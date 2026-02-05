# frozen_string_literal: true

json.data do
  json.array! @lookups do |lk|
    json.id lk.name
    json.options lk.lookup_options do |option|
      json.value option.data.value
      json.label option.data.label
      json.description option.data.description
      json.icon rails_blob_path(option.icon, only_path: true) if option.icon.attached?
    end
  end
end.compact!
