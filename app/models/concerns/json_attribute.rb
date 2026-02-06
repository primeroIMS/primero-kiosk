# frozen_string_literal: true

# Concern for handling JSON attributes in ActiveRecord models.
#
# Usage:
#   class MyModel < ApplicationRecord
#     include JsonAttribute
#
#     # Wrap a JSON column in a value object (wrapper_class).
#     # If array: true, the attribute is treated as an array of wrappers.
#     json_attribute :settings, SettingsWrapper
#     json_attribute :rules, RuleWrapper, array: true
#   end
#
# Notes:
# - respond to .new(hash)
# - expose #attributes (hash) for serialization
# - include ActiveModel::Model for validations
module JsonAttribute
  extend ActiveSupport::Concern

  class_methods do # rubocop:disable Metrics/BlockLength
    def json_attribute(name, wrapper_class, array: false) # rubocop:disable Metrics/AbcSize,Metrics/CyclomaticComplexity,Metrics/MethodLength,Metrics/PerceivedComplexity
      type = Class.new(ActiveModel::Type::Value) do
        define_method(:cast_value) do |value|
          return if value.nil?

          if array
            Array(value).map { |v| cast_one(v) }
          else
            cast_one(value)
          end
        end

        define_method(:cast_one) do |value| # rubocop:disable Metrics/MethodLength
          case value
          when wrapper_class
            value
          when String
            decoded = begin
              ActiveSupport::JSON.decode(value)
            rescue StandardError
              nil
            end
            decoded && wrapper_class.new(decoded)
          when Hash
            wrapper_class.new(value)
          end
        end

        define_method(:serialize) do |value|
          result = if array
                     Array(value).map { |v| primitive(v) }.compact
                   else
                     primitive(value)
                   end

          result.to_json
        end

        define_method(:primitive) do |value| # rubocop:disable Metrics/CyclomaticComplexity,Metrics/MethodLength
          case value
          when nil
            nil
          when wrapper_class
            value.attributes.transform_values { |v| primitive(v) }
          when Hash
            value.transform_values { |v| primitive(v) }
          when Array
            value.map { |v| primitive(v) }
          else
            value
          end
        end

        define_method(:changed_in_place?) do |raw_old_value, new_value|
          cast_value(raw_old_value) != new_value
        end
      end

      attribute name, type.new

      validate do
        val = public_send(name)
        next if val.nil? || val.valid?

        val.errors.each do |error|
          errors.add("#{name}.#{error.attribute}", error.message)
        end
      end
    end
  end
end
