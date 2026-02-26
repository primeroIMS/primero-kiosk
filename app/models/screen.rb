# frozen_string_literal: true

# Represents a Screen entity.
class Screen < ApplicationRecord
  include JsonAttribute

  json_attribute :data, Screen::Data

  belongs_to :app_flow

  has_one_attached :featured_image

  def self.create_or_update(app_flow_id:, **screen_hash)
    app_flow = AppFlow.find_by('data ->> \'unique_id\' = ?', app_flow_id)
    screen = Screen.find_by('data ->> \'id\' = ?', screen_hash[:id])

    return Screen.create!(data: screen_hash, app_flow_id: app_flow.id) if screen.nil?

    screen.update!(data: screen_hash, app_flow_id: app_flow.id)
    screen
  end
end
