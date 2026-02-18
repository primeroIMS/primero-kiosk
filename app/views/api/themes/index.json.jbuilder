# frozen_string_literal: true

if @theme.present?
  json.data do
    json.site_title @theme.site_title || 'Primero Kiosk'
    json.kiosk_name @theme.kiosk_name || 'Primero Kiosk'
    json.colors @theme.colors
    json.copy @theme.copy
  end.compact!
end
