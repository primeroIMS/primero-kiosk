# frozen_string_literal: true

# Represents a Screen entity.
class Screen < ApplicationRecord
  include JsonAttribute

  json_attribute :data, Screen::Data

  belongs_to :app_flow

  has_one_attached :featured_image

  def self.create_or_update(app_flow_id:, **screen_hash)
    app_flow = AppFlow.find_by('data ->> \'unique_id\' = ?', app_flow_id)
    screen = Screen.where(app_flow_id: app_flow.id).find_by('data ->> \'id\' = ?', screen_hash[:id])

    return Screen.create!(data: screen_hash, app_flow_id: app_flow.id) if screen.nil?

    screen.update!(data: screen_hash, app_flow_id: app_flow.id)
    screen
  end

  def update_translations(locale, translations_hash)
    translations_hash.each do |key, value|
      case key
      when 'fields' then update_field_translations(locale, value)
      else update_nested_translations(locale, key, value)
      end
    end

    save!
  end

  private

  def update_field_translations(locale, fields_hash)
    return if fields_hash.blank?

    fields_hash.each do |slot, field_translations|
      field = data.fields&.find { |f| f.slot == slot }
      next if field.blank?

      field_translations.each do |prop, translated_value|
        update_localized_property(field, locale, prop, translated_value)
      end
    end
  end

  def update_nested_translations(locale, key, value)
    nested = data.respond_to?(key) ? data.public_send(key) : nil
    return if nested.blank?

    value.each do |prop, translated_value|
      update_localized_property(nested, locale, prop, translated_value)
    end
  end

  def update_localized_property(target, locale, property, value)
    setter = "#{property}_i18n="
    return unless target.respond_to?(setter)

    translation_value = value.is_a?(Hash) ? value['text'] : value
    return if translation_value.blank?

    current = target.public_send(property) || {}
    target.public_send(setter, current.merge(locale => translation_value))
  end
end
