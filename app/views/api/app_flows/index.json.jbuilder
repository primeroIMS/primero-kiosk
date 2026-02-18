# frozen_string_literal: true

json.data do
  json.array! @app_flows do |af|
    json.unique_id af.data.unique_id
    json.handle af.data.handle
    json.starting_screen_id af.data.starting_screen_id
    json.record_definitions af.data.record_definitions do |rd|
      json.id rd.id
      json.type rd.type
      json.module_id rd.module_id
    end
    json.logo rails_blob_path(af.logo, only_path: true) if af&.logo&.attached?
    json.logo_pictorial rails_blob_path(af.logo_pictorial, only_path: true) if af&.logo_pictorial&.attached?
    if af&.logo_pictorial_secondary&.attached?
      json.logo_pictorial_secondary rails_blob_path(af.logo_pictorial_secondary,
                                                    only_path: true)
    end
    json.screens af.screens, partial: 'screen', as: :screen
  end
end.compact!
