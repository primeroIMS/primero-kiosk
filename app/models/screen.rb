# frozen_string_literal: true

# Represents a Screen entity.
class Screen < ApplicationRecord
  include JsonAttribute

  json_attribute :data, Screen::Data

  has_one_attached :featured_image

  def self.create_or_update(screen_hash)
    screen = Screen.find_by('data ->> \'id\' = ?', screen_hash[:id])
    return Screen.create! data: screen_hash if screen.nil?

    screen.update! data: screen_hash
    screen
  end
end
