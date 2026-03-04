# frozen_string_literal: true

# Represents an Option within a Screen, utilizing JSON nested model capabilities.
class Screen::Character
  include JsonNestedModel

  attribute :bg_color, :string
  attribute :lookup_id, :string
  attribute :default_id, :string
  attribute :show, :boolean, default: false
  attribute :at_bottom, :boolean, default: false
end
