# frozen_string_literal: true

# Represents a Lookup entity.
class Lookup < ApplicationRecord
  has_many :lookup_options, dependent: :destroy

  accepts_nested_attributes_for :lookup_options, allow_destroy: true

  def self.create_or_update(attributes)
    lookup = find_or_initialize_by(name: attributes[:name])
    lookup.lookup_options.delete_all if lookup.persisted?
    lookup.lookup_options_attributes = attributes[:lookup_options_attributes]
    lookup.save!
  end
end
