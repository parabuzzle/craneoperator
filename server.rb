require 'oj'
require 'pry'
require 'erb'
require 'time'
require 'sinatra/base'
require 'sinatra/cross_origin'
require './lib/config.rb'
require './lib/helpers.rb'

class CraneOp < Sinatra::Base
  register Sinatra::CrossOrigin
  include Helpers

  configure do
    enable :cross_origin
    enable :sessions
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
    set :session_secret, Configuration.new.session_secret
  end

  def conf
    return Configuration.new
  end

  ## Basic Auth ##

  if Configuration.new.username
    config = Configuration.new
    use Rack::Auth::Basic, "Please Authenticate to View" do |username, password|
      username == config.username and password == ( config.password || '' )
    end
  end

  ## Registry API Methods ##

  def fetch_catalog(next_string=nil)
    query={n: 100, last: next_string}
    json = get("/v2/_catalog", conf, session, {}, query)
    if json['errors']
      return json
    end
    return [] if json['repositories'].nil?
    repos = []
    repos += json['repositories']
    unless json['repositories'].empty?
      repos += fetch_catalog(repos.last)
    end
    return repos
  end

  def containers(filter=nil)
    repos = fetch_catalog
    return repos if repos.is_a?(Hash) && repos['errors']
    if filter
      return repos.select{ |i| i.match(/#{filter}.*/)}
    end
    return repos
  end

  def container_tags(repo, filter=nil)
    json = get("/v2/#{repo}/tags/list", conf, session)
    return nil if json['tags'].nil?
    tags = json['tags'] || []
    if filter
      return sort_versions(tags.select{ |i| i.match(/#{filter}.*/)}).reverse
    end
    sort_versions(tags).reverse
  end

  def container_info(repo, manifest)
    json = get("/v2/#{repo}/manifests/#{manifest}", conf, session)

    # Add extra fields for easy display
    if json['history']
      history = json['history'].shift
      json['information'] = Oj.load(history['v1Compatibility'])

      json['layer_info'] = []
      json['history'].each do |i|
        json['layer_info'] << Oj.load(i['v1Compatibility'])
      end
      json['layer_info'].reverse!
      created_at = Time.parse(json['information']['created'])
      json['information']['created_formatted'] = created_at.to_s
      json['information']['created_millis']    = (created_at.to_f * 1000).to_i
    end

    return json
  end

  def fetch_digest(repo, manifest)
    response = get_head("/v2/#{repo}/manifests/#{manifest}", conf, session, { 'Accept' => 'application/vnd.docker.distribution.manifest.v2+json'})
    return response.headers["docker-content-digest"]
  end

  def image_delete(repo, manifest)
    digest = fetch_digest(repo, manifest)
    return send_delete("/v2/#{repo}/manifests/#{digest}", conf, session, { 'Accept' => 'application/vnd.docker.distribution.manifest.v2+json'})
  end

  ## Endpoints ##

  get '/api' do
    return "API Version #{conf.version}"
  end

  get '/api/containers' do
    content_type :json
    repos = containers(params[:filter])
    if !repos.is_a?(Array)
      halt 401, {'content-type' => 'application/json'}, {'message' => "Registry requires authentication"}.to_json
    end
    repos.to_json
  end

  get '/api/tags/*' do |container|
    content_type :json
    tags = container_tags(container, params[:filter])
    halt 404 if tags.nil?
    tags.to_json
  end

  post '/api/login' do
    content_type :json
    params = Oj.load(request.body.read)
    session.delete(:username)
    session.delete(:password)
    username = params['username']
    password = params['password']
    if check_login(conf, session, username, password)
      session[:username] = username
      session[:password] = password
      return {status: "success"}.to_json
    end
    halt 401, {error: "credentials are wrong"}.to_json
  end

  get '/logout' do
    session.destroy
    redirect '/'
  end

  get /api\/containers\/(.*\/)(.*)/ do |container, tag|

    # This is here because we need to handle slashes in container names
    container.chop!

    content_type :json

    info = container_info(container, tag)

    halt 404 if info['errors']
    halt 404 if info['fsLayers'].nil?

    info.to_json
  end

  get '/api/registryinfo' do
    content_type :json
    info = {
      host: conf.registry_host,
      public_url: conf.registry_public_url,
      port: conf.registry_port,
      protocol: conf.registry_protocol,
      ssl_verify: conf.ssl_verify,
      delete_allowed: conf.delete_allowed,
      login_allowed: conf.login_allowed,
      title: conf.title,
    }
    if session[:username]
      info[:username] = session[:username]
    end
    info.to_json
  end

  delete /api\/containers\/(.*\/)(.*)/ do |container, tag|
    halt 404 unless to_bool(conf.delete_allowed)

    container.chop!
    response = image_delete( container, tag )
    headers = response.headers
    response.body
  end

  # React app endpoints
  [
    "/containers/*",
    "/containers",
    "/login",
    "/login/",
    "/",
  ].each do |path|
    get path do
      erb :index, locals: { title: conf.title}
    end
  end

  # Error Handlers
  error do
    File.read(File.join('public', '500.html'))
  end

  not_found do
    status 404
    File.read(File.join('public', '404.html'))
  end

  # Debug endpoints
  if Configuration.new.debug
    get '/api/session' do
      session.to_hash.to_json
    end

    get '/api/config' do
      conf.to_hash.to_json
    end

    get '/api/login' do
      content_type :json
      session.delete(:username)
      session.delete(:password)
      username = params['username']
      password = params['password']
      if check_login(conf, session, username, password)
        session[:username] = username
        session[:password] = password
        return {status: "success"}.to_json
      end
      halt 401, {error: "credentials are wrong"}.to_json
    end

  end

end
