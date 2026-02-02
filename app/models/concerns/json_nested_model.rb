# frozen_string_literal: true

# Provides functionality for models that are nested JSON structures.
module JsonNestedModel
  extend ActiveSupport::Concern

  included do
    include ActiveModel::Model
    include ActiveModel::Attributes

    def assign_attributes(new_attributes)
      return if new_attributes.blank?

      new_attributes.each do |k, v|
        send("#{k}=", v) if respond_to?("#{k}=")
      end
    end

    def as_json(_options = {})
      attributes
    end
  end

  class_methods do
    def attribute_hash(name, klass)
      attribute name, default: -> { klass.new }

      define_method("#{name}=") do |value|
        super(value.is_a?(klass) ? value : klass.new(value))
      end

      validate do
        obj = public_send(name)
        next if obj.nil? || obj.valid?

        obj.errors.each { |error| errors.add("#{name}.#{error.attribute}", error.message) }
      end
    end

    # rubocop:disable Metrics/AbcSize
    def attribute_array(name, klass)
      attribute name, default: -> { [] }

      define_method("#{name}=") do |values|
        super(Array(values).map { |v| v.is_a?(klass) ? v : klass.new(v) })
      end

      validate do
        public_send(name).each_with_index do |obj, i|
          next if obj.valid?

          obj.errors.each { |error| errors.add("#{name}[#{i}].#{error.attribute}", error.message) }
        end
      end
    end
    # rubocop:enable Metrics/AbcSize
  end
end
