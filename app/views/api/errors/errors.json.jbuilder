# frozen_string_literal: true

json.errors do
  json.array! @errors do |error|
    json.partial! 'api/errors/error', error:
  end
end
