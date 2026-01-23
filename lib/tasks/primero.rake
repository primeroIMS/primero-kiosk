# frozen_string_literal: true

namespace :primero_kiosk do
  desc 'Export translations to JS file(s)'
  task :i18n_js do
    Dir.glob(Rails.root.join('app', 'frontend', 'translations.*')).each { |file| File.delete(file) }

    `bundle exec i18n export -r lib/i18n_loader.rb`
  end
end
