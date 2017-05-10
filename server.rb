require 'oj'
require 'httparty'
require 'pry'
require 'erb'
require 'time'
require 'sinatra/base'
require 'sinatra/cross_origin'

class CraneOp < Sinatra::Base
  register Sinatra::CrossOrigin

  configure do
    enable :cross_origin
    mime_type :javascript, 'application/javascript'
    mime_type :javascript, 'text/javascript'
    set :logging, true
    set :static, true
    set :allow_origin, :any
    set :allow_methods, [:get, :post, :options]
    set :allow_credentials, true
    set :max_age, "1728000"
    set :expose_headers, ['Content-Type']
    set :json_encoder, :to_json
  end

  ## Setup ##

  def registry_host
    ENV['REGISTRY_HOST'] || 'localhost'
  end

  def registry_port
    ENV['REGISTRY_PORT'] || '5000'
  end

  def registry_proto
    ENV['REGISTRY_PROTO'] || 'https'
  end

  def registry_ssl_verify
    ENV['REGISTRY_SSL_VERIFY'] || 'true'
  end

  def registry_public_url
    ENV['REGISTRY_PUBLIC_URL'] || "#{registry_host}:#{registry_port}"
  end

  def registry_username
    ENV['REGISTRY_USERNAME']
  end

  def registry_password
    ENV['REGISTRY_PASSWORD']
  end

  def delete_allowed
    ENV['REGISTRY_ALLOW_DELETE'] || 'false'
  end

  ## Authentication ##

  if ENV['USERNAME']
    use Rack::Auth::Basic, "Please Authenticate to View" do |username, password|
      username == ENV['USERNAME'] and password == ( ENV['PASSWORD'] || '' )
    end
  end

  ## Helpers ##

  def to_bool(str)
    str.to_s.downcase == 'true'
  end

  def html(view)
    File.read(File.join('public', "#{view.to_s}.html"))
  end

  def sort_versions(ary)
    valid_version_numbers = ary.select { |i| i if i.match(/^[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+(-[[:alnum:]]+)?$/) }
    non_valid_version_numbers = (ary - valid_version_numbers).sort
    versions = valid_version_numbers.sort_by {|v| Gem::Version.new( v.gsub(/^[a-z|A-Z|.]*/, '') ) } + non_valid_version_numbers
    if versions.include?('latest')
      # Make sure 'latest' appears at the top of the list
      versions.delete('latest')
      versions.unshift('latest')
    end
    versions.reverse
  end

  def registry_url
    url_parts = []

    url_parts << registry_proto
    url_parts << "://"
    if registry_username
      url_parts << "#{registry_username}:#{registry_password}@"
    end
    url_parts << registry_host
    url_parts << ":"
    url_parts << registry_port

    url_parts.join
  end

  ## Registry API Methods ##

  def containers
    response = HTTParty.get( "#{registry_url}/v2/_catalog", verify: to_bool(registry_ssl_verify) )
    json = Oj.load response.body
    json['repositories']
  end

  def container_tags(repo)
    response = HTTParty.get( "#{registry_url}/v2/#{repo}/tags/list", verify: to_bool(registry_ssl_verify) )
    json = Oj.load response.body
    tags = json['tags'] || []
    tags = sort_versions(tags).reverse
  end

  def container_info(repo, manifest)
    response = HTTParty.get( "#{registry_url}/v2/#{repo}/manifests/#{manifest}", verify: to_bool(registry_ssl_verify) )
    json = Oj.load response.body

    # Add extra fields for easy display
    json['information'] = Oj.load(json['history'].first['v1Compatibility'])

    created_at = Time.parse(json['information']['created'])
    json['information']['created_formatted'] = created_at.to_s
    json['information']['created_millis']    = (created_at.to_f * 1000).to_i
    return json
  end

  def fetch_digest(repo, manifest)
    headers = {
      'Accept' => 'application/vnd.docker.distribution.manifest.v2+json'
    }
    response = HTTParty.head( "#{registry_url}/v2/#{repo}/manifests/#{manifest}", headers: headers, verify: to_bool(registry_ssl_verify) )
    return response.headers["docker-content-digest"]
  end

  def image_delete(repo, manifest)
    headers = {
      'Accept' => 'application/vnd.docker.distribution.manifest.v2+json'
    }
    digest = fetch_digest(repo, manifest)
    response = HTTParty.delete( "#{registry_url}/v2/#{repo}/manifests/#{digest}", headers: headers, verify: to_bool(registry_ssl_verify) )
    return response
  end

  ## Endpoints ##

  get '/' do
    html :index
  end

  get '/containers.json' do
    content_type :json

    containers.to_json
  end

  get '/container/*/tags.json' do |container|
    content_type :json

    tags = container_tags(container)
    halt 404 if tags.nil?
    tags.to_json
  end

  get /container\/(.*\/)(.*.json)/ do |container, tag|

    # This is here because we need to handle slashes in container names
    container.chop!
    tag.gsub!('.json', '')

    content_type :json

    info = container_info(container, tag)

    halt 404 if info['errors']
    halt 404 if info['fsLayers'].nil?

    info.to_json
  end

  get '/registryinfo' do
    content_type :json
    {
      host: registry_host,
      public_url: registry_public_url,
      port: registry_port,
      protocol: registry_proto,
      ssl_verify: to_bool(registry_ssl_verify),
      delete_allowed: to_bool(delete_allowed),
    }.to_json
  end

  delete /container\/(.*\/)(.*.json)/ do |container, tag|
    halt 404 unless to_bool(delete_allowed)

    container.chop!
    tag.gsub!('.json', '')
    response = image_delete( container, tag )
    headers = response.headers
    response.body
  end

  # Error Handlers
  error do
    File.read(File.join('public', '500.html'))
  end

  not_found do
    status 404
    File.read(File.join('public', '404.html'))
  end

end
