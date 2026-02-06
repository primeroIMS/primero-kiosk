# frozen_string_literal: true

json.data do
  json.locale I18n.locale
  json.default_locale I18n.default_locale
  json.locales I18n.available_locales
  json.rtl_locales @system_setting.rtl_locales
  json.record_definitions @system_setting.record_definitions
  json.starting_screen_id @system_setting.starting_screen_id
end.compact!
