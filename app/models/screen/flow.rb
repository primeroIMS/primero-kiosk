# frozen_string_literal: true

# Represents the flow structure for a Screen.
class Screen::Flow
  include JsonNestedModel
  include LocalizableJsonProperty

  attribute :allow_skip, :string
  attribute :allow_back, :string
  attribute :next_screen, :string
  attribute :end_of_flow, :string
  attribute :label_i18n, default: {}

  localize_jsonb_properties %i[label]
end
