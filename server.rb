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
    set :session_secret, (ENV["SESSION_SECRET"] || "insecure-session-secret!")
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

  def containers(filter=nil)
    json = get("/v2/_catalog", conf, session)
    if filter
      return json['repositories'].select{ |i| i.match(/#{filter}.*/)}
    end
    repos = json['repositories']
    repos = [] if repos.nil?
    return repos
  end

  def container_tags(repo, filter=nil)
    json = get("/v2/#{repo}/tags/list", conf, session)
    tags = json['tags'] || []
    if filter
      return sort_versions(tags.select{ |i| i.match(/#{filter}.*/)}).reverse
    end
    sort_versions(tags).reverse
  end

  def container_info(repo, manifest)
    json = get("/v2/#{repo}/manifests/#{manifest}", conf, session)

    # Add extra fields for easy display
    json['information'] = Oj.load(json['history'].first['v1Compatibility'])

    created_at = Time.parse(json['information']['created'])
    json['information']['created_formatted'] = created_at.to_s
    json['information']['created_millis']    = (created_at.to_f * 1000).to_i
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
    containers(params[:filter]).to_json
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
    }
    if session[:username]
      info[:username] = session[:username]
    end
    info.to_json
  end

  delete /api\/containers\/(.*\/)(.*)/ do |container, tag|
    halt 404 unless to_bool(delete_allowed)

    container.chop!
    response = image_delete( container, tag )
    headers = response.headers
    response.body
  end

  # send endpoints that the react app handles
    [
      '/',
      '/container',
      '/container/*',
      '/login',
    ].each do |route|
    get route do
      html :index
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
