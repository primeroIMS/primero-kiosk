# frozen_string_literal: true

json.data do
  json.array! @screens do |screen|
    json.id screen.data.id
    json.bg_color screen.data.bg_color
    json.component screen.data.component
    json.featured_image rails_blob_path(screen.featured_image, only_path: true) if screen.featured_image.attached?
    json.fields screen.data.fields do |field|
      json.field_id field.field_id
      json.scope field.scope
      json.backend_id field.backend_id
      json.type field.type
      json.placeholder field.placeholder_i18n
      json.label field.label_i18n
      json.record_definition field.record_definition
      json.lookup field.lookup
    end
    json.title do
      json.color screen.data.title.color
      json.text screen.data.title.text_i18n
    end
    json.description do
      json.color screen.data.title.color
      json.text screen.data.title.text_i18n
    end
    json.flow do
      json.allow_skip screen.data.flow.allow_skip
      json.allow_back screen.data.flow.allow_back
      json.next_screen screen.data.flow.next_screen
      json.end_of_flow screen.data.flow.end_of_flow
      json.label_next screen.data.flow.label_next_i18n
      json.label_back screen.data.flow.label_back_i18n
      json.label_back screen.data.flow.label_back_i18n
    end
  end
end.compact!
