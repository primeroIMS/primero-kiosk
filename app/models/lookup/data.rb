# frozen_string_literal: true

# Represents the data structure for LookupOption JSON attribute.
class Lookup::Data
  include LocalizableJsonProperty
  include JsonNestedModel

  attribute :value, :string
  attribute :label
  attribute :description
  attribute_hash :meta, Element::Option

  localize_jsonb_properties %i[label description]

  validates :value, presence: true
  validates :label, presence: true
end
