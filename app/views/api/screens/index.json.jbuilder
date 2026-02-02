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
  end
end.compact!
