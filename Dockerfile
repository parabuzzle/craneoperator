# This docker file sets up the rails app container
#
# https://docs.docker.com/reference/builder/

FROM ruby:2.3.6-alpine
MAINTAINER Mike Heijmans <parabuzzle@gmail.com>

# Add env variables
ENV PORT=80 \
    REGISTRY_HOST=localhost \
    REGISTRY_PORT=5000 \
    REGISTRY_PROTOCOL=https \
    REGISTRY_SSL_VERIFY=true \
    REGISTRY_ALLOW_DELETE=false \
    APP_HOME=/webapp

RUN mkdir -p $APP_HOME
# switch to the application directory for exec commands
WORKDIR $APP_HOME

# Add the app
COPY . $APP_HOME

RUN apk add --update nodejs g++ musl-dev make linux-headers && \
    npm install --no-optional && \
    node_modules/.bin/webpack && \
    rm -rf node_modules && \
    gem update bundler && \
    bundle install --deployment && \
    apk del nodejs g++ musl-dev make linux-headers

# Run the app
CMD ["bundle", "exec", "foreman", "start"]
