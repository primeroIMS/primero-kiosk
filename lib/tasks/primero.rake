# frozen_string_literal: true

namespace :primero do
  desc 'Export translations to JS file(s)'
  task :i18n_js do
    require 'i18n-js'

    Dir.glob(Rails.root.join('app', 'frontend', 'translations.*')).each { |file| File.delete(file) }

    `bundle exec i18n export`
  end
end
