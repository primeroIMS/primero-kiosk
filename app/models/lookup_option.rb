# frozen_string_literal: true

# Represents a LookupOption entity.
class LookupOption < ApplicationRecord
  include JsonAttribute

  json_attribute :data, Lookup::Data

  belongs_to :lookup

  has_one_attached :icon
end
