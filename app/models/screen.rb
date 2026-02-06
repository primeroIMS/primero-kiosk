# frozen_string_literal: true

# Represents a Screen entity.
class Screen < ApplicationRecord
  include JsonAttribute

  json_attribute :data, Screen::Data

  has_one_attached :featured_image
end
