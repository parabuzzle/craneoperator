require 'oj'
require 'httparty'
require 'pry'
require 'erb'
require 'sinatra/base'

class CraneOp < Sinatra::Base

  configure do
    mime_type :javascript, 'application/javascript'
    mime_type :javascript, 'text/javascript'
    set :logging, true
    set :static, true
  end

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

  def to_bool(str)
    str.downcase == 'true'
  end

  def containers
    response = HTTParty.get( "#{registry_proto}://#{registry_host}:#{registry_port}/v2/_catalog", verify: to_bool(registry_ssl_verify) )
    json = Oj.load response.body
    json['repositories']
  end

  def container_tags(repo)
    response = HTTParty.get( "#{registry_proto}://#{registry_host}:#{registry_port}/v2/#{repo}/tags/list", verify: to_bool(registry_ssl_verify) )
    json = Oj.load response.body
    tags = json['tags'] || []
    tags.sort { |x,y|
      matcher = /[a-z]/i

      if x.match(matcher)
        a = nil
      else
        a = x.split('.').last.to_i
      end

      if y.match(matcher)
        b = nil
      else
        b = y.split('.').last.to_i
      end

      a && b ? a <=> b : a ? -1 : 1
    }.reverse
  end

  def container_info(repo, manifest)
    response = HTTParty.get( "#{registry_proto}://#{registry_host}:#{registry_port}/v2/#{repo}/manifests/#{manifest}", verify: to_bool(registry_ssl_verify) )
    json = Oj.load response.body
  end

  def container_blob(repo, digest='HEAD')
    response = HTTParty.get( "#{registry_proto}://#{registry_host}:#{registry_port}/v2/#{repo}/blobs/#{digest}", verify: to_bool(registry_ssl_verify) )
    json = Oj.load response.body
  end

  get '/test' do
    erb :index
  end

  get '/' do
    @containers = containers
    erb :index
  end

  get '/about' do
    erb :about
  end

  get '/container/:name' do |name|
    @container_tags = container_tags(name)
    @name = name
    halt 404 if @container_tags.nil?
    erb :container
  end

  get '/container/:name/:tag' do |name, tag|
    @tag = tag
    @name = name
    @container_info = container_info(name, tag)
    @container_tags = container_tags(name)
    halt 404 if @container_info['errors']
    halt 404 if @container_info['fsLayers'].nil?
    erb :tag
  end

  error 404 do
    erb :'404'
  end

  not_found do
    status 404
    erb :'404'
  end

end
