# frozen_string_literal: true

# A service that returns the permitted fields
class PermittedFieldService
  attr_accessor :with_cache

  def self.instance
    new(Rails.configuration.use_app_cache)
  end

  def initialize(with_cache = false)
    self.with_cache = with_cache
  end

  def permitted_fields
    return permitted_fields_from_cache if with_cache

    fields_with_option_ids
  end

  private

  def permitted_fields_from_cache(force = false)
    app_flow_key = "appflow/#{AppFlow.maximum(:updated_at).as_json}"
    screen_key = "screens/#{Screen.maximum(:updated_at).as_json}"
    lookup_key = "lookups/#{Lookup.maximum(:updated_at).as_json}"
    # The assumption here is that the cache will be updated if any changes took place to Screens, AppFlow or Lookup
    cache_key = "permitted_field_service/#{app_flow_key}/#{screen_key}/#{lookup_key}"

    Rails.cache.fetch(cache_key, expires_in: 48.hours, force:) do
      fields_with_option_ids
    end
  end

  def fields_with_option_ids
    lookup_option_ids = Lookup.includes(:lookup_options).to_h { |l| [l.name, l.values] }
    (fields_calculated + fields_from_screen + fields_from_channel).map do |field|
      next(field) unless field.lookup_id.present?

      field.option_ids = lookup_option_ids[field.lookup_id]
      field
    end
  end

  def fields_from_channel
    channel_field_keys = AppFlow.all.map do |af|
      af.data.record_definitions.map do |rd|
        rd.channel.keys
      end
    end

    channel_field_keys.flatten.map { |key| Screen::Field.new(backend_id: key, component: 'TextInput') }
  end

  def fields_from_screen
    Screen.all.each_with_object([]) do |screen, memo|
      screen.data.fields.each do |field|
        next if field.scope == 'kiosk' || memo.any? { |elem| elem.backend_id == field.backend_id }

        field.component = screen.data.component
        field.nullable = true
        memo << field
      end
    end
  end

  # rubocop:disable Metrics/MethodLength
  # TODO: We are hardcoding calculated fields protection_concerns, owned_by, risk.
  # This code will need to handle calculated fields in the future.
  def fields_calculated
    [
      Screen::Field.new(
        backend_id: 'owned_by',
        lookup_id: 'assignment_users',
        component: 'SingleSelect',
        nullable: false
      ),
      Screen::Field.new(
        backend_id: 'risk_level',
        lookup_id: 'risk_level',
        component: 'SingleSelect',
        nullable: true
      ),
      Screen::Field.new(
        backend_id: 'protection_concerns',
        lookup_id: 'protection_concerns',
        component: 'MultiSelect',
        nullable: true
      ),
      Screen::Field.new(
        backend_id: 'module_id',
        option_ids: %w[primeromodule_cp],
        component: 'TextInput',
        nullable: false
      ),
      Screen::Field.new(
        backend_id: 'language',
        lookup_id: 'language',
        component: 'LanguageSelect',
        nullable: false
      )
    ]
  end
  # rubocop:enable Metrics/MethodLength
end
