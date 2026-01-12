# frozen_string_literal: true

# Custom miscellaneous Primero configurations, pulled from the environment

Rails.application.configure do
  # Path to the i18n translation strings used by the front end
  manifest = Rails.root.join('config', 'i18n-manifest.txt')
  config.i18n_translations_file = File.exist?(manifest) ? File.read(manifest) : nil
end
