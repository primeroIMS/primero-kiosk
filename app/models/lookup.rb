# frozen_string_literal: true

# Represents a Lookup entity.
class Lookup < ApplicationRecord
  has_many :lookup_options, dependent: :destroy, class_name: 'Lookup::Option'

  def self.create_or_update(attributes)
    lookup = find_or_initialize_by(name: attributes[:name])
    lookup.lookup_options.delete_all if lookup.persisted?
    lookup.lookup_options = attributes[:lookup_options]
    lookup.save!
  end

  def update_translations(locale, options_hash)
    options_hash.each do |option_value, translated_label|
      option = option_for_value(option_value)
      next if option.blank?

      apply_label_translation(option, locale, translated_label)
    end
  end

  private

  def option_for_value(option_value)
    lookup_options.find { |opt| opt.data.value == option_value.to_s }
  end

  def apply_label_translation(option, locale, translated_label)
    current_label = option.data.label || {}
    option.data.label_i18n = current_label.merge(locale => translated_label)
    option.data = option.data.attributes
    option.save!
  end
end
