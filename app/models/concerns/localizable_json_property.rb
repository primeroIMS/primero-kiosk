# frozen_string_literal: true

# Methods that allow the dynamic generation of i18n getters and setters
module LocalizableJsonProperty
  extend ActiveSupport::Concern

  # Define class methods
  module ClassMethods
    def localize(properties, localized_property_variable)
      properties = properties.flatten
      properties.each do |property|
        build_accessors_methods(property)
      end

      instance_variable_set(localized_property_variable, (instance_variable_get(localized_property_variable) || [])
                                                            .concat(properties))
    end

    def localize_jsonb_properties(*properties)
      localize(properties, :@localized_jsonb_properties)
    end

    def localized_jsonb_properties
      @localized_jsonb_properties
    end

    def build_accessors_methods(property)
      define_method("#{property}_i18n=") do |value|
        return if value.blank?

        normalized = normalize_i18n_hash(value)
        return if normalized.blank?

        send("#{property}=", normalized)
      end
    end
  end

  private

  def normalize_i18n_hash(value)
    return unless value.is_a?(Hash)

    i18n_hash = value.dup.with_indifferent_access
    base_value = i18n_hash[I18n.locale.to_s] || i18n_hash[I18n.default_locale]

    return unless base_value.present?

    I18n.available_locales.each do |locale|
      locale_key = locale.to_s
      i18n_hash[locale_key] ||= base_value
    end

    i18n_hash
  end
end
