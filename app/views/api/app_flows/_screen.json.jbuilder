# frozen_string_literal: true

json.id screen.data.id
json.bg_color screen.data.bg_color
json.button screen.data.button
json.logo_secondary screen.data.logo_secondary
json.component screen.data.component
json.options screen.data.options
json.featured_image rails_blob_path(screen.featured_image, only_path: true) if screen.featured_image.attached?
json.fields screen.data.fields do |field|
  json.backend_id field.backend_id
  json.slot field.slot
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
