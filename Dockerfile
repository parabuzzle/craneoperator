# This docker file sets up the rails app container
#
# https://docs.docker.com/reference/builder/

FROM niche/ruby-base:0.1
MAINTAINER Mike Heijmans <parabuzzle@gmail.com>

# switch to tmp for handling the bundle
WORKDIR /tmp

# Apply Current Gemfile on top of that
ADD Gemfile* /tmp/
RUN bundle install

# switch to the application directory for exec commands
WORKDIR $APP_HOME

# Add the app
ADD . $APP_HOME

# Expose needed ports
EXPOSE 4567

# Run the app
CMD bundle exec foreman start
