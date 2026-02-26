# frozen_string_literal: true

require 'yaml'

# Exports all screens and lookups as YAML for translation
class ConfigTranslationExporter
  NESTED_ATTRIBUTES = {
    Screen::Data => %i[fields title description flow]
  }.freeze
  attr_accessor :export_directory, :locale, :export_filename

  def initialize(opts = {})
    opts[:export_directory] ||= "configuration_translation_export_#{DateTime.now.strftime('%Y%m%d.%I%M%S')}"
    @export_directory = opts[:export_directory]
    @locale = (opts[:locale].presence || I18n.default_locale).to_s
    @export_filename = opts[:export_filename] || "#{@locale}.yml"
    FileUtils.mkdir_p(@export_directory)
  end

  def export
    file_paths = export_screens

    lookups_hash = export_lookups
    if lookups_hash.present?
      file_path = File.join(@export_directory, 'lookups.yml')
      File.write(file_path, { @locale => { 'lookups' => lookups_hash } }.to_yaml)
      file_paths << file_path
    end

    puts "Exported I18n configurations to #{@export_directory}"
    file_paths.first
  end

  private

  def export_screens
    app_flow_data = group_screens_by_app_flow

    app_flow_data.filter_map do |app_flow_id, screens_data|
      write_app_flow_file(app_flow_id, screens_data)
    end
  end

  def group_screens_by_app_flow
    Screen.includes(:app_flow).find_each.with_object(Hash.new { |h, k| h[k] = {} }) do |screen, app_flow_data|
      add_screen_to_app_flow_data(screen, app_flow_data)
    end
  end

  def add_screen_to_app_flow_data(screen, app_flow_data)
    extracted = extract_i18n(screen.data)

    extracted.delete('id') if extracted.is_a?(Hash)

    app_flow_id = screen.app_flow.data.unique_id
    app_flow_data[app_flow_id]['screens'] ||= {}
    app_flow_data[app_flow_id]['screens'][screen.data.id] = extracted
  end

  def write_app_flow_file(app_flow_id, screens_data)
    return nil if screens_data.blank?

    file_path = File.join(@export_directory, "#{app_flow_id}.yml")
    File.write(file_path, { @locale => screens_data }.to_yaml)
    file_path
  end

  def export_lookups
    Lookup.includes(:lookup_options).find_each.with_object({}) do |lookup, lookups_hash|
      lookup_name = lookup.name
      next if lookup_name.blank?

      options_hash = options_for_lookup(lookup)
      lookups_hash[lookup_name] = options_hash if options_hash.present?
    end
  end

  def extract_i18n(data)
    localized_properties = localized_properties_for(data)
    nested_keys = NESTED_ATTRIBUTES.fetch(data.class, [])

    data = data.try(:attributes) || data

    return data unless data.is_a?(Hash) || data.is_a?(Array)

    return extract_from_array(data) if data.is_a?(Array)

    extract_from_hash(data, localized_properties, nested_keys)
  end

  def localized_properties_for(data)
    data.class.try(:localized_jsonb_properties) || []
  end

  def extract_from_array(data)
    array_results = data.filter_map { |item| extract_i18n(item).presence }
    convert_array_results(array_results)
  end

  def extract_from_hash(data, localized_properties, nested_keys = [])
    data.each_with_object({}) do |(k, v), result|
      pair = handle_localized_pair(k, v, localized_properties)

      if pair
        result[pair[0]] = pair[1]
        next
      end

      next unless extractable_nested?(k, v, nested_keys)

      nested = extract_i18n(v)
      result[k] = nested if nested.present?
    end
  end

  def simplify_extracted(extracted)
    return nil if extracted.blank?
    return extracted['label'] if extracted.is_a?(Hash) && extracted.keys == ['label']

    extracted
  end

  def options_for_lookup(lookup)
    lookup.lookup_options.each_with_object({}) do |option, h|
      value = option.data.value
      next unless value.present?

      simplified = simplify_extracted(extract_i18n(option.data))
      h[value] = simplified if simplified.present?
    end
  end

  def convert_array_results(array_results)
    %w[slot field_id id].each do |key|
      return array_results.to_h { |h| [h.delete(key), h] } if array_results.all? { |h| h.is_a?(Hash) && h.key?(key) }
    end

    array_results
  end

  def extractable_nested?(key, value, nested_keys)
    return true if %w[slot field_id id].include?(key.to_s)

    value.is_a?(Hash) || value.is_a?(Array) || nested_keys.include?(key.to_sym)
  end

  def localized_key?(key, value, localized_properties)
    localized_properties.include?(key.to_sym) ||
      (value.is_a?(Hash) && value.key?(@locale))
  end

  def localized_value_for(value)
    return unless value.is_a?(Hash)

    value[@locale]
  end

  def handle_localized_pair(key, value, localized_properties)
    return nil unless localized_key?(key, value, localized_properties)

    locale_value = localized_value_for(value)
    return nil if locale_value.blank?

    [key, locale_value]
  end
end
