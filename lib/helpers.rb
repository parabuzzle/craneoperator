require 'base64'
require 'oj'
require 'httparty'

module Helpers

  @_cache = LruRedux::TTL::Cache.new(100, 5 * 60)

  def self.cache
    @_cache
  end

  def sort_versions(ary)
    valid_version_numbers = ary.select { |i| i if i.match(/^[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+(-[[:alnum:]]+)?$/) }
    non_valid_version_numbers = ary - valid_version_numbers
    versions = valid_version_numbers.sort_by {|v| Gem::Version.new( v.gsub(/^[a-z|A-Z|.]*/, '') ) } + non_valid_version_numbers.sort
    if versions.include?('latest')
      # Make sure 'latest' appears at the top of the list
      versions.delete('latest')
      versions.push('latest')
    end
    versions
  end

  def to_bool(str)
    str.to_s.downcase == 'true'
  end

  def html(view)
    File.read(File.join('public', "#{view.to_s}.html"))
  end

  def generateHeaders(url, config, session, headers: {}, login: {}, auth_type: nil, method: 'get')
    username = login[:username] || session[:username] || config.registry_username
    password = login[:password] || session[:password] || config.registry_password
    auth_type = auth_type || config.auth_type

    if username
      case auth_type
      when "basic"
        headers['Authorization'] = "Basic #{base64_docker_auth(username, password)}"
      when "token"
        token = getRegistryToken(url, config, session, login: login, method: method)
        headers['Authorization'] = "Bearer #{token}"
      end
    end
    return headers
  end

  def base64_docker_auth(username, password)
    Base64.encode64("#{username}:#{password}").chomp
  end

  def append_header(headers, addl_header)
     headers.merge addl_header
  end

  def get(url, config, session, headers: {}, query: {})
    response = http_get(url, config, session, headers: headers, query: query)
    json = Oj.load response.body
    if json['errors']
      puts "Error talking to the docker registry!"
      json['errors'].each do |error|
        puts "  -  " + error['code'].to_s + ": " + error['message']
      end
    end
    return json
  end

  def http_get(url, config, session, headers: {}, query: {}, login: {})
    HTTParty.get(
      "#{config.registry_url}#{url}",
      verify: config.ssl_verify,
      query: query,
      headers: generateHeaders(url, config, session, headers: headers, login: login, method: 'get')
    )
  end

  def http_head(url, config, session, headers: {})
    HTTParty.head(
      "#{config.registry_url}#{url}",
      verify: config.ssl_verify,
      headers: generateHeaders(url, config, session, headers: headers, method: 'head')
    )
  end

  def http_delete(url, config, session, headers: {})
    HTTParty.delete(
      "#{config.registry_url}#{url}",
      verify: config.ssl_verify,
      headers: generateHeaders(url, config, session, headers: headers, method: 'delete')
    )
  end

  def check_login(config, session, username=nil, password=nil, headers={})
    if username.nil?
      return false
    end
    login = {username: username, password: password}

    response = http_get('/v2/_catalog', config, session, headers: headers, login: login)
    return response.code != 401
  end

  def getRegistryToken(url, config, session, login: {}, method: 'get')
    # enbrace the 401; the response headers tell us where the authorization service is
    username = login[:username] || session[:username] || config.registry_username
    cache_key = "#{username}__#{method}__#{url}"
    token = Helpers.cache[cache_key.to_sym]
    if !token
      token = generateRegistryToken(url, config, session, login: login, method: method)
      Helpers.cache[cache_key.to_sym] = token
    end

    return token
  end

  def generateRegistryToken(url, config, session, login: {}, method: 'get')
    headers = generateHeaders(url, config, session, login: login, auth_type: 'none', method: method)
    response = HTTParty.send(
      method,
      "#{config.registry_url}#{url}",
      verify: config.ssl_verify,
      headers: headers
    )
    www_auth = response.headers["www-authenticate"]
    auth_url = www_auth.match(/realm="(?<auth_url>[^"]+)"/).captures[0]
    service  = www_auth.match(/service="([^"]+)"/).captures[0]
    scope    = www_auth.match(/scope="([^"]+)"/).captures[0]

    # use basic auth against the auth service
    jwt_response = HTTParty.get(
      "#{auth_url}",
      query: {
        'service' => service,
        'scope' => scope,
      },
      verify: config.ssl_verify,
      headers: generateHeaders(url, config, session, headers: headers, login: login, auth_type: 'basic')
    )
    body = JSON.parse(jwt_response.body)
    
    # relay our web token
    return body["token"]

  end
end
