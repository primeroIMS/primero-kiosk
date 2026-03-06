# frozen_string_literal: true

# Represents the data structure for a Screen.
class Screen::Data
  include JsonNestedModel

  COMPONENT_TYPES = %w[
    CharacterInformation
    CharacterSelection
    CharacterWelcome
    CharacterPurpose
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

  MULTISELECT_COMPONENTS = %w[
    MultiSelect
    MultiSelectOrWrite
  ].freeze

  attribute :id, :string
  attribute :bg_color, :string
  attribute :logo_secondary, :boolean
  attribute :component, :string
  attribute_array :fields, Screen::Field
  attribute_hash :character, Screen::Character
  attribute_hash :calculations, Screen::Calculations
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
