# frozen_string_literal: true

source 'https://rubygems.org'

gem 'azure-blob', '~> 0.5', require: false
gem 'bootsnap', require: false
gem 'faraday', '~> 2.14'
gem 'faraday-net_http_persistent', '~> 2.3'
gem 'faraday-retry', '~> 2.4'
gem 'i18n-js', '~> 4.2'
gem 'image_processing', '~> 1.2'
gem 'jbuilder', '~> 2.14'
gem 'json_schemer', '~> 2.5'
gem 'pg', '~> 1.1'
gem 'puma', '>= 5.0'
# TODO: We are using the latest rack-attack commit on the 'main' branch in order to have access to the
# ActionDispatch::Request.remote_ip functionality. The diff with latest stable v6.8.0 has been reviewed:
# https://github.com/rack/rack-attack/compare/v6.8.0...e938879178075afbf0dda4e99f0e11d408720b41
gem 'rack-attack', git: 'https://github.com/rack/rack-attack/', ref: 'e938879178075afbf0dda4e99f0e11d408720b41'
gem 'rails', '~> 8.1.1'
gem 'solid_cable'
gem 'solid_cache'
gem 'solid_queue'
gem 'thruster', require: false
gem 'tzinfo-data'
gem 'vite_rails', '~> 3.0'

group :development, :test do
  gem 'brakeman', require: false
  gem 'bundler-audit', require: false
  gem 'debug', platforms: %i[mri windows], require: 'debug/prelude'
  gem 'rspec-rails', '~> 8.0'
  gem 'rubocop-rails-omakase', require: false
end
