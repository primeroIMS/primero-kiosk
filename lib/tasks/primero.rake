# frozen_string_literal: true

namespace :primero do
  desc 'Export translations to JS file(s)'
  task :i18n_js do
    Dir.glob(Rails.root.join('app', 'frontend', 'translations.js')).each { |file| File.delete(file) }

    I18nJS.call(config_file: Rails.root.join('config/i18n.yml'))
  end
end
