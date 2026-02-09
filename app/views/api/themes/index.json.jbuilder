# frozen_string_literal: true

if @theme.present?
  json.data do
    json.site_title @theme.site_title || 'Primero'
    json.kiosk_name @theme.kiosk_name || 'Primero'
    json.colors @theme.colors
    json.copy @theme.copy
    json.logo rails_blob_path(@theme.logo, only_path: true) if @theme&.logo&.attached?
    json.logo_pictorial rails_blob_path(@theme.logo_pictorial, only_path: true) if @theme&.logo_pictorial&.attached?
    if @theme&.logo_pictorial_secondary&.attached?
      json.logo_pictorial_secondary rails_blob_path(@theme.logo_pictorial_secondary,
                                                    only_path: true)
    end
  end.compact!
end
