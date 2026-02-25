# frozen_string_literal: true

# Custom miscellaneous Primero Kiosk configurations, pulled from the environment

Rails.application.configure do
  # Path to the i18n translation strings used by the front end
  manifest = Rails.root.join('config', 'i18n-manifest.txt')
  config.i18n_translations_file = File.exist?(manifest) ? File.read(manifest) : nil

  kiosk_use_app_cache = ENV.fetch('KIOSK_USE_APP_CACHE', nil)
  config.use_app_cache = Rails.env.production? || ActiveRecord::Type::Boolean.new.cast(kiosk_use_app_cache)
end
