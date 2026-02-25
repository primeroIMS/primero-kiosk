# frozen_string_literal: true

# Represents the data structure for an AppFlow.
class AppFlow < ApplicationRecord
  include JsonAttribute

  json_attribute :data, AppFlow::Data

  has_many :screens, dependent: :destroy

  has_one_attached :logo
  has_one_attached :logo_pictorial
  has_one_attached :logo_pictorial_secondary

  def self.create_or_update(app_flow_hash)
    app_flow = AppFlow.find_by('data ->> \'unique_id\' = ?', app_flow_hash[:unique_id])
    return AppFlow.create!(data: app_flow_hash) if app_flow.nil?

    app_flow.update!(data: app_flow_hash)
    app_flow
  end
end
