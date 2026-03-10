# frozen_string_literal: true

# Represents the field structure for a Screen.
class Screen::Field
  include JsonNestedModel
  include LocalizableJsonProperty

  NUMBER = 'number'

  # option_ids: ids for the lookup options
  # component: screen component
  # nullable: whether the field is nullable
  attr_accessor :option_ids, :component, :nullable

  attribute :slot, :string
  attribute :scope, :string
  attribute :backend_id, :string
  attribute :type, :string
  attribute :placeholder, default: {}
  attribute :label, default: {}
  attribute :lookup_id, :string

  localize_jsonb_properties %i[placeholder label]

  validates :slot, presence: true
  validates :scope, presence: true, if: -> { backend_id.present? }
end
