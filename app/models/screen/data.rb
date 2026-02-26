# frozen_string_literal: true

# Represents the data structure for a Screen.
class Screen::Data
  include JsonNestedModel

  COMPONENT_TYPES = %w[
    CharacterInformation
    CharacterSelection
    CharacterWelcome
    ComfortingResponse
    Hub
    HubWithCharacter
    HubWelcome
    LanguageSelect
    MultiSelect
    ResponseGoodBye
    SelectOrWrite
    MultiSelectOrWrite
    SingleSelect
    TextArea
    TextInput
  ].freeze

  attribute :id, :string
  attribute :bg_color, :string
  attribute :logo_secondary, :boolean
  attribute :component, :string
  attribute :character_lookup_id, :string
  attribute :show_character, :boolean, default: false
  attribute :start_new_record, :boolean, default: false
  attribute_array :fields, Screen::Field
  attribute_hash :button, Element::Option
  attribute_hash :title, Screen::Heading
  attribute_hash :description, Screen::Heading
  attribute_hash :flow, Screen::Flow
  attribute_hash :options, Element::Option

  validates :component, presence: true
  validates :flow, presence: true
  validates :bg_color, hex_color: true, allow_nil: true

  validate :component_type_must_be_valid

  def component_type_must_be_valid
    return if COMPONENT_TYPES.include?(component)

    errors.add(:component, 'must be a valid component type')
  end
end
