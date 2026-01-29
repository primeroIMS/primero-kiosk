# frozen_string_literal: true

# Represents the data structure for a Screen.
class Screen::Data
  include JsonNestedModel

  attribute :id, :string
  attribute :bg_color, :string
  attribute :component, :string
  attribute :show_character, :boolean, default: false
  attribute :start_new_record, :boolean, default: false
  attribute :lookups_id, :string
  attribute_array :fields, ::Screen::Field
  attribute_hash :title, Screen::Title
  attribute_hash :description, Screen::Description
  attribute_hash :flow, Screen::Flow

  validates :component, presence: true
  validates :flow, presence: true
  validates :fields, presence: true
  validates :bg_color, hex_color: true
end
