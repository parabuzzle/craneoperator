require 'oj'
require 'httparty'
require 'pry'
require 'sinatra/base'

class CraneOp < Sinatra::Base

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
    json['tags']
  end


  get '/' do
    body = []
    body << "<table>"
    body << "<tr><th>Known Containers</th></tr>"
    containers.each do |container|
      body << "<tr><td><a href='/container/#{container}'>#{container}</a></td></tr>"
    end
    body << "</table>"
    body.join("\n")
  end

  get '/container/:name' do |name|
    body = []
    body << "<a href='/'>Home</a><br/><br/>"
    body << "<h1>#{name}</h1>"
    body << "<table>"
    body << "<tr><th>Tags</th></tr>"
    container_tags(name).each do |tag|
      body << "<tr><td>#{tag}</td></tr>"
    end
    body << "</table>"
    body.join("\n")
  end

end
