# frozen_string_literal: true

## Represents the conditions structure for a Flow.
class Screen::Condition
  include JsonNestedModel

  attribute :conditions, default: {}
  attribute :default, :string
end

# Represents the next_screen structure for a Flow.
class Screen::NextScreen
  include JsonNestedModel

  attribute_array :conditions, Screen::Condition
  attribute :default, :string
end

# Represents the flow structure for a Screen.
class Screen::Flow
  include JsonNestedModel
  include LocalizableJsonProperty

  attribute :allow_skip, :boolean
  attribute :allow_back, :boolean
  attribute_hash :next_screen, Screen::NextScreen
  attribute :end_of_flow, :string
  attribute :label_i18n, default: {}

  localize_jsonb_properties %i[label]
end
