# frozen_string_literal: true

# Represents the data structure for LookupOption JSON attribute.
class LookupData
  include JsonNestedModel
  include LocalizableJsonProperty

  attribute :value, :string
  attribute :label_i18n, default: {}
  attribute :description_i18n, default: {}

  localize_jsonb_properties %i[label description]

  validates :value, presence: true
  validates :label_i18n, presence: true
end

# Represents a LookupOption entity.
class LookupOption < ApplicationRecord
  include JsonAttribute

  json_attribute :data, LookupData

  belongs_to :lookup

  has_one_attached :icon
end
