# frozen_string_literal: true

json.data do
  json.array! @lookups do |lk|
    json.id lk.name
    json.options lk.lookup_options do |option|
      json.value option.data.value
      json.label option.data.label_i18n
      json.description option.data.description_i18n if option.data.description_i18n
    end
  end
end.compact!
