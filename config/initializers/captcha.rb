# frozen_string_literal: true

Rails.application.config.captcha_enabled = ActiveRecord::Type::Boolean.new.cast(
  ENV.fetch('PRIMERO_CAPTCHA_ENABLED', false)
)
return unless Rails.application.config.captcha_enabled

def load_settings
  settings_file = Rails.root.join('config', 'captcha.yml')
  return {} unless File.exist?(settings_file)

  YAML.safe_load_file(settings_file, aliases: true)&.with_indifferent_access || {}
end

provider = ENV.fetch('PRIMERO_CAPTCHA_PROVIDER', nil)
@captcha_settings = load_settings if provider.present?

Rails.application.config.x.captcha_provider = provider
captcha = @captcha_settings&.dig(provider) || {}

if provider == 'turnstile'
  captcha['secret_key'] = ENV.fetch('PRIMERO_CAPTCHA_SECRET_KEY', nil)
  captcha['site_key'] = ENV.fetch('PRIMERO_CAPTCHA_SITE_KEY', nil)
end

Rails.application.config.x.captcha = captcha
