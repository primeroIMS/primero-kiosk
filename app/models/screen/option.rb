# frozen_string_literal: true

# Represents an Option within a Screen, utilizing JSON nested model capabilities.
class Screen::Option
  include JsonNestedModel

  attribute :bg_color, :string
  attribute :text_color, :string
  attribute :border_color, :string

  validates :bg_color, hex_color: true, allow_nil: true
  validates :text_color, hex_color: true, allow_nil: true
  validates :border_color, hex_color: true, allow_nil: true
end
