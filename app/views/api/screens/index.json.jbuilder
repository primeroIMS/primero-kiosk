# frozen_string_literal: true

json.data do
  json.array! @screens do |screen|
    json.id screen.data.id
    json.bg_color screen.data.bg_color
    json.component screen.data.component
    json.fields screen.data.fields
    json.title screen.data.title
    json.description screen.data.description
    json.flow screen.data.flow
    json.featured_image rails_blob_path(screen.featured_image, only_path: true) if screen.featured_image.attached?
  end
end.compact!
