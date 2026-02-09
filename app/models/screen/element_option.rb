# frozen_string_literal: true

# Represents an Option within a Screen, utilizing JSON nested model capabilities.
class Screen::ElementOption
  include JsonNestedModel

  attribute :bg_color, :string
  attribute :text_color, :string
  attribute :border_color, :string
  attribute :bg_selected_color, :string
  attribute :text_selected_color, :string
  attribute :border_selected_color, :string

  validates :bg_color, hex_color: true, allow_nil: true
  validates :text_color, hex_color: true, allow_nil: true
  validates :border_color, hex_color: true, allow_nil: true
  validates :bg_selected_color, hex_color: true, allow_nil: true
  validates :text_selected_color, hex_color: true, allow_nil: true
  validates :border_selected_color, hex_color: true, allow_nil: true
end
