require 'base64'
require 'oj'
require 'httparty'

module Helpers

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

  def generateHeaders(config, session, headers={}, login={})
    username = login[:username] || session[:username] || config.registry_username
    password = login[:password] || session[:password] || config.registry_password
    if username
      headers['Authorization'] = "Basic #{base64_docker_auth(username, password)}"
    end
    return headers
  end

  def base64_docker_auth(username, password)
    Base64.encode64("#{username}:#{password}").chomp
  end

  def append_header(headers, addl_header)
     headers.merge addl_header
  end

  def get(url, config, session, headers={}, query={})
    response = HTTParty.get( "#{config.registry_url}#{url}", verify: config.ssl_verify, query: query, headers: generateHeaders(config, session, headers) )
    json = Oj.load response.body
    if json['errors']
      puts "Error talking to the docker registry!"
      json['errors'].each do |error|
        puts "  -  " + error['code'].to_s + ": " + error['message']
      end
    end
    return json
  end

  def get_head(url, config, session, headers={})
    HTTParty.head( "#{config.registry_url}#{url}", verify: config.ssl_verify, headers: generateHeaders(config, session, headers) )
  end

  def send_delete(url, config, session, headers={})
    HTTParty.delete( "#{config.registry_url}#{url}", verify: config.ssl_verify, headers: generateHeaders(config, session, headers) )
  end

  def check_login(config, session, username=nil, password=nil, headers={})
    if username.nil?
      return false
    end
    login = {username: username, password: password}
    response = HTTParty.get( "#{config.registry_url}/v2/_catalog", verify: config.ssl_verify, headers: generateHeaders(config, session, headers, login) )
    return response.code != 401
  end
end
