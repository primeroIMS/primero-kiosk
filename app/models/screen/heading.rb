# frozen_string_literal: true

# Represents the heading structure for a Screen.
class Screen::Heading
  include JsonNestedModel
  include LocalizableJsonProperty

  attribute :text_i18n, default: {}
  attribute :color, :string

  localize_jsonb_properties %i[text]

  validates :text_i18n, presence: true
  validates :color, hex_color: true, allow_nil: true
end
