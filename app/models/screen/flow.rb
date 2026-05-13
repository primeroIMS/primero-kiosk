# frozen_string_literal: true

# Represents the next_screen structure for a Flow.
class Screen::NextScreen
  include JsonNestedModel

  attribute :award_badge_path, :string
  attribute :conditions, array: true
  attribute :default, :string
end

# Represents the flow structure for a Screen.
class Screen::Flow
  include JsonNestedModel
  include LocalizableJsonProperty

  attribute :record_definition_id, :string
  attribute :allow_skip, :boolean
  attribute :allow_back, :boolean
  attribute :allow_exit, :boolean
  attribute_hash :next_screen, Screen::NextScreen
  attribute :end_of_flow, :boolean
  attribute :label_next, default: {}
  attribute :label_skip, default: {}
  attribute :label_back, default: {}

  localize_jsonb_properties %i[label_next label_skip label_back]
end
