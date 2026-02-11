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

  def permitted_field_ids_from_cache(force = false)
    last_updated_at = Screen.max(:updated_at).as_json
    # The assumption here is that the cache will be updated if any changes took place to Screens
    cache_key = "permitted_field_service/#{last_updated_at}"

    Rails.cache.fetch(cache_key, expires_in: 48.hours, force:) do
      permitted_field_ids_from_screens
    end
  end

  def permitted_field_ids_from_screens
    Screen.all.each_with_object([]) do |screen, memo|
      screen.data.fields.each do |field|
        next if field.scope == 'global' || memo.include?(field.backend_id)

        memo << field.backend_id
      end
    end
  end
end
