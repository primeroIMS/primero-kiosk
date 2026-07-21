# frozen_string_literal: true

# This specifies the locales the Primero Kiosk currently supports
#
# ku-IQ: This locale represents the Kurdish Badini subdialect of Kurmanji, as spoken in Dohuk in
#        Western Iraqi Kurdistan Region and North-East Syria
# ku:    This locale represents the Kurdish Sorani (Central Kurdish) dialect as spoken in
#        Eastern Iraqi Kurdistan Region (Erbil, Sulamaniya)
class PrimeroKiosk::Application
  LOCALE_ENGLISH = :en
  LOCALE_ARABIC = :ar
  LOCALES = %i[
    en ar ar-IQ ar-JO ar-LB ar-SD bn es es-GT fa-AF fr id km ku ku-IQ my ps-AF pt pt-BR so sw-KE sw-TZ th ne ro ru uk pl
    sk hu es-ES om am-ET tr cmn tet aeb ar-SY it ti mn hy pt-AO pt-MZ
  ].freeze
  RTL_LOCALES = %i[ar ar-IQ ar-JO ar-LB ar-SD fa-AF ku ku-IQ ps-AF aeb ar-SY].freeze
end

def locale_settings
  return @locale_settings if @locale_settings

  @locale_settings = build_locale_settings
end

def build_locale_settings
  settings_file = Rails.root.join('config', 'locales.yml')
  return {} unless File.exist?(settings_file)

  env_settings = load_env_settings(settings_file)
  apply_env_overrides(env_settings)

  env_settings
end

def load_env_settings(settings_file)
  settings = YAML.safe_load_file(settings_file, aliases: true)&.with_indifferent_access || {}
  settings[Rails.env] || {}
end

def apply_env_overrides(env_settings)
  env_settings['default_locale'] = ENV['LOCALE_DEFAULT'] if ENV['LOCALE_DEFAULT'].present?
  env_settings['locales'] = ENV['LOCALE_ALL'].split(',').map(&:strip).reject(&:empty?) if ENV['LOCALE_ALL'].present?
end

I18n.default_locale = locale_settings['default_locale'] || PrimeroKiosk::Application::LOCALE_ENGLISH
I18n.available_locales = if locale_settings['locales'].present?
                           locale_settings['locales']
                         else
                           PrimeroKiosk::Application::LOCALES
                         end
