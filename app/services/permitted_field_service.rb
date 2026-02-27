# frozen_string_literal: true

# A service that returns the permitted field ids for configured screens.
class PermittedFieldService
  attr_accessor :with_cache

  def self.instance
    new(Rails.configuration.use_app_cache)
  end

  def initialize(with_cache = false)
    self.with_cache = with_cache
  end

  def permitted_field_ids
    return permitted_field_ids_from_cache if with_cache

    permitted_field_ids_from_screens
  end

  private

  def permitted_field_ids_from_cache(force = false)
    last_updated_at = Screen.maximum(:updated_at).as_json
    # The assumption here is that the cache will be updated if any changes took place to Screens
    cache_key = "permitted_field_service/#{last_updated_at}"

    Rails.cache.fetch(cache_key, expires_in: 48.hours, force:) do
      permitted_field_ids_from_screens
    end
  end

  def permitted_fields_without_screen
    %w[owned_by risk_level].map(&:to_sym)
  end

  def permitted_array_fields
    ['protection_concerns'].map { |field| { field.to_sym => [] } }
  end

  def permitted_channels
    AppFlow.all.map do |af|
      af.data.record_definitions.map do |rd|
        rd.channel.keys
      end
    end.flatten.map(&:to_sym)
  end

  # TODO: Refactor this method. This is a temp fix to get all permitted fields.
  def permitted_screen_fields # rubocop:disable Metrics/AbcSize
    Screen.all.each_with_object([]) do |screen, memo|
      screen.data.fields.each do |field|
        next if field.scope == 'kiosk' || memo.include?(field.backend_id)

        if Screen::Data::MULTISELECT_COMPONENTS.include?(screen.data.component)
          memo << { field.backend_id.to_sym => [] }
          next
        end

        memo << field.backend_id.to_sym
      end
    end
  end

  def permitted_field_ids_from_screens
    permitted_screen_fields + permitted_channels + permitted_fields_without_screen + permitted_array_fields
  end
end
