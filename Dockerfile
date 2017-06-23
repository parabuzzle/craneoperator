# This docker file sets up the rails app container
#
# https://docs.docker.com/reference/builder/

FROM ruby:2.3.1
MAINTAINER Mike Heijmans <parabuzzle@gmail.com>

RUN apt-get update && \
    apt-get install python-software-properties -y && \
    curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get install nodejs -y

# Add env variables
ENV PORT 80
ENV REGISTRY_HOST localhost
ENV REGISTRY_PORT=5000
ENV REGISTRY_PROTO=https
ENV REGISTRY_SSL_VERIFY=true
ENV REGISTRY_ALLOW_DELETE=false
ENV APP_HOME=/webapp

RUN mkdir -p $APP_HOME
# switch to the application directory for exec commands
WORKDIR $APP_HOME

# Add the app
ADD . $APP_HOME

RUN gem install httparty memoist && \
    npm install && \
    node_modules/.bin/webpack

RUN gem update bundler

RUN bundle install

# Run the app
CMD bundle exec foreman start
