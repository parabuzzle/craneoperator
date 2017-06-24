# This docker file sets up the rails app container
#
# https://docs.docker.com/reference/builder/

FROM ruby:2.3.1
MAINTAINER Mike Heijmans <parabuzzle@gmail.com>

# Add env variables
ENV PORT=80 \
    REGISTRY_HOST=localhost \
    REGISTRY_PORT=5000 \
    REGISTRY_PROTO=https \
    REGISTRY_SSL_VERIFY=true \
    REGISTRY_ALLOW_DELETE=false \
    APP_HOME=/webapp

RUN mkdir -p $APP_HOME
# switch to the application directory for exec commands
WORKDIR $APP_HOME

# Add the app
ADD . $APP_HOME

RUN apt-get update && \
    apt-get install python-software-properties -y && \
    curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get install nodejs -y && \
    npm install && \
    node_modules/.bin/webpack && \
    rm -rf node_modules && \
    apt-get purge nodejs python-software-properties -y && \
    rm -rf /var/lib/apt/lists/*

RUN gem update bundler

RUN bundle install

# Run the app
CMD bundle exec foreman start
