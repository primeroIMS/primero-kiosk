# frozen_string_literal: true

json.data do
  json.locale I18n.locale
  json.default_locale I18n.default_locale
  json.locales I18n.available_locales
  json.rtl_locales @system_setting.rtl_locales

  if Rails.configuration.x.captcha_provider.present?
    json.captcha do
      json.provider Rails.configuration.x.captcha_provider
      json.site_key Rails.configuration.x.captcha[:site_key]
    end
  end
end.compact!
