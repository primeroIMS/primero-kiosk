# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Exporters::ConfigTranslationExporter do
  let(:export_directory) { Dir.mktmpdir }
  let(:locale) { 'es' }
  let(:exporter) { described_class.new(export_directory: export_directory, locale: locale) }

  after do
    FileUtils.remove_entry(export_directory)
  end

  describe '#export' do
    before do
      app_flow = AppFlow.create_or_update(unique_id: 'buddy_bot', starting_screen_id: 'language', handle: 'buddy-bot')
      Screen.create!(
        app_flow_id: app_flow.id,
        data: {
          id: 'test_screen',
          component: 'SingleSelect',
          bg_color: '#FFFFFF',
          fields: [
            { slot: 'slot_1', placeholder_i18n: { 'en' => 'Select', 'es' => 'Seleccionar' } }
          ],
          title: { text_i18n: { 'en' => 'Hello', 'es' => 'Hola' }, color: '#000000' },
          flow: { next_screen: { default: 'end' } }
        }
      )

      lookup = Lookup.create!(name: 'test_lookup')
      Lookup::Option.create!(
        lookup: lookup,
        data: {
          value: 'opt1',
          label_i18n: { 'en' => 'Option 1', 'es' => 'Opción 1' }
        }
      )
    end

    it 'exports localized data for the given locale to multiple YAML files' do
      exporter.export

      screen_file = File.join(export_directory, 'test_screen.yml')
      expect(File.exist?(screen_file)).to be(true)

      screen_yaml = YAML.load_file(screen_file)
      expect(screen_yaml.keys.first).to eq('es')

      test_screen = screen_yaml['es']['screens.test_screen']
      expect(test_screen['title']['text']).to eq('Hola')

      expect(test_screen['fields']).to be_a(Hash)
      expect(test_screen['fields']['slot_1']['placeholder']).to eq('Seleccionar')

      lookups_file = File.join(export_directory, 'lookups.yml')
      expect(File.exist?(lookups_file)).to be(true)

      lookups_yaml = YAML.load_file(lookups_file)
      expect(lookups_yaml.keys.first).to eq('es')

      test_lookup = lookups_yaml['es']['lookups']['test_lookup']
      expect(test_lookup['opt1']).to eq('Opción 1')
    end
  end
end
