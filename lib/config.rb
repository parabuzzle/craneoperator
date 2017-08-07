class Configuration

  attr_accessor :registry_password,
                :registry_username,
                :registry_host,
                :registry_port,
                :registry_protocol,
                :ssl_verify,
                :registry_public_url,
                :delete_allowed,
                :username,
                :password,
                :version,
                :debug,
                :login_allowed,
                :title,
                :session_secret

  def initialize
    @registry_username   = ENV['REGISTRY_USERNAME']
    @registry_password   = ENV['REGISTRY_PASSWORD']
    @registry_host       = ENV['REGISTRY_HOST'] || 'localhost'
    @registry_port       = ENV['REGISTRY_PORT'] || '5000'
    @registry_protocol   = ENV['REGISTRY_PROTOCOL'] || 'https'
    @registry_public_url = ENV['REGISTRY_PUBLIC_URL'] || "#{@registry_host}:#{@registry_port}"
    @ssl_verify          = to_bool(ENV['SSL_VERIFY'] || 'true')
    @delete_allowed      = to_bool(ENV['REGISTRY_ALLOW_DELETE'] || 'false')
    @username            = ENV['USERNAME']
    @password            = ENV['PASSWORD']
    @version             = "2.2"
    @debug               = to_bool(ENV['DEBUG'] || 'false')
    @login_allowed       = to_bool(ENV['ALLOW_REGISTRY_LOGIN'] || 'false')
    @title               = ENV['TITLE'] || "Crane Operator"
    @session_secret      = ENV['SESSION_SECRET'] || "insecure-session-secret!"
  end

  def to_bool(str)
    str.to_s.downcase == 'true'
  end

  def registry_url
    "#{registry_protocol}://#{registry_host}:#{registry_port}"
  end

  def to_hash
    {
      :registry_password   => @registry_password,
      :registry_username   => @registry_username,
      :registry_host       => @registry_host,
      :registry_port       => @registry_port,
      :registry_protocol   => @registry_protocol,
      :ssl_verify          => @ssl_verify,
      :registry_public_url => @registry_public_url,
      :delete_allowed      => @delete_allowed,
      :username            => @username,
      :password            => @password,
      :version             => @password,
      :debug               => @debug,
      :login_allowed       => @login_allowed,
      :title               => @title,
      :session_secret      => @session_secret,
    }
  end

end
