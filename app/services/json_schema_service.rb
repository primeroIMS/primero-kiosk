# frozen_string_literal: true

# Creates a Json Schema
class JsonSchemaService
  RECORD_TYPES = %w[case incident registry].freeze
  DEFAULT_PROPERTIES = {
    'record_type' => { 'type' => %w[string], 'enum' => RECORD_TYPES },
    'data' => { 'type' => 'object', 'properties' => {}, 'additionalProperties' => false }
  }.freeze

  class << self
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    def create(fields)
      schema = { 'type' => 'object', 'properties' => DEFAULT_PROPERTIES, 'additionalProperties' => false }
      return schema unless fields.present?

      fields.each_with_object(schema) do |field, schema_hash|
        properties = schema_hash['properties']['data']['properties']
        if field.type == Screen::Field::NUMBER
          properties[field.backend_id] = number_schema(field)
        else
          case field.component
          when 'TextInput', 'TextArea'
            properties[field.backend_id] = string_schema(field)
          when 'SingleSelect'
            properties[field.backend_id] = select_schema(field)
          when 'MultiSelect', 'LanguageSelect'
            properties[field.backend_id] = multi_select_schema(field)
          end
        end
      end
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize

    private

    def number_schema(field)
      types = %w[integer]
      types << 'null' if field.nullable
      { 'type' => types, 'minimum' => -2_147_483_648, 'maximum' => 2_147_483_647 }
    end

    def string_schema(field)
      types = %w[string]
      types << 'null' if field.nullable
      { 'type' => types }
    end

    def multi_select_schema(field)
      schema = { 'type' => %w[array], 'items' => { 'type' => 'string' }.merge(enum_prop(field)) }
      schema['type'] << 'null' if field.nullable
      schema
    end

    def select_schema(field)
      schema = { 'type' => %w[string] }.merge(enum_prop(field))
      return schema unless field.nullable

      { 'anyOf' => [schema, { 'type' => %w[null] }] }
    end

    def enum_prop(field)
      return {} unless field.lookup_id.present?

      { 'enum' => field.option_ids || [] }
    end
  end
end
