# frozen_string_literal: true

# rubocop:disable Metrics/BlockLength
json.data do
  json.array! @screens do |screen|
    json.id screen.data.id
    json.bg_color screen.data.bg_color
    json.component screen.data.component
    json.featured_image rails_blob_path(screen.featured_image, only_path: true) if screen.featured_image.attached?
    json.fields screen.data.fields do |field|
      json.backend_id field.backend_id
      json.field_id field.field_id
      json.label field.label
      json.lookup field.lookup
      json.placeholder field.placeholder
      json.record_definition field.record_definition
      json.scope field.scope
      json.type field.type
    end
    json.title do
      json.color screen.data.title.color
      json.text screen.data.title.text
    end
    json.description do
      json.color screen.data.description.color
      json.text screen.data.description.text
    end
    json.flow do
      json.allow_skip screen.data.flow.allow_skip
      json.allow_back screen.data.flow.allow_back
      json.end_of_flow screen.data.flow.end_of_flow
      json.label_back screen.data.flow.label_back
      json.label_next screen.data.flow.label_next
      json.label_skip screen.data.flow.label_skip
      json.next_screen screen.data.flow.next_screen
    end
  end
end.compact!
# rubocop:enable Metrics/BlockLength
