# frozen_string_literal: true

# Represents the data structure for LookupOption JSON attribute.
class LookupData
  include LocalizableJsonProperty
  include JsonNestedModel

  attribute :value, :string
  attribute :label
  attribute :description

  localize_jsonb_properties %i[label description]

  validates :value, presence: true
  validates :label, presence: true
end

# Represents a LookupOption entity.
class LookupOption < ApplicationRecord
  include JsonAttribute

  json_attribute :data, LookupData

  belongs_to :lookup

  has_one_attached :icon
end
