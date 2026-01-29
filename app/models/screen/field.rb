# frozen_string_literal: true

# Represents the field structure for a Screen.
class Screen::Field
  include JsonNestedModel
  include LocalizableJsonProperty

  attribute :field_id, :string
  attribute :scope, :string
  attribute :backend_id, :string
  attribute :type, :string
  attribute :placeholder_i18n, default: {}
  attribute :label_i18n, default: {}
  attribute :record_definition, :string

  localize_jsonb_properties %i[placeholder label]

  validates :field_id, presence: true
  validates :scope, presence: true, if: -> { backend_id.present? }
end
