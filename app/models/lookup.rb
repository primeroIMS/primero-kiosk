# frozen_string_literal: true

# Represents a Lookup entity.
class Lookup < ApplicationRecord
  has_many :lookup_options, dependent: :destroy

  def self.create_or_update(attributes)
    lookup = find_or_initialize_by(name: attributes[:name])
    lookup.lookup_options.delete_all if lookup.persisted?
    lookup.lookup_options = attributes[:lookup_options]
    lookup.save!
  end
end
