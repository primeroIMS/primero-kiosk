# frozen_string_literal: true

json.short_name @theme&.kiosk_name
json.name @theme&.kiosk_name
json.description @theme&.site_description&.[]('en')
json.start_url '/'
json.background_color '#ffffff'
json.display 'standalone'
json.theme_color @theme&.colors&.[]('manifest_theme_color')
json.icons do
  Theme::PICTORIAL_SIZES.each do |size|
    logo = @theme.send(:"logo_pictorial_#{size}")
    img_src = if logo.present?
                rails_blob_path(logo, only_path: true)
              else
                "/primero-pictorial-#{size}.png"
              end

    json.child! do
      json.src img_src
      json.type 'image/png'
      json.sizes "#{size}x#{size}"
    end
  end
end
