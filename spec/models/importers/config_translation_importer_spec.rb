# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ConfigTranslationImporter do
  let(:export_directory) { Dir.mktmpdir }
  let(:locale) { 'es' }

  describe '#import' do
    context 'for lookup translations' do
      let(:lookup_name) { 'test_lookup' }
      let!(:lookup) do
        Lookup.create_or_update(
          name: lookup_name,
          lookup_options: [
            Lookup::Option.new(data: { id: 'opt_1', value: 'yes', label: { 'en' => 'Yes' } })
          ]
        )
        Lookup.find_by(name: lookup_name)
      end

      let(:lookup_yaml_path) do
        File.join(export_directory, 'lookups.yml').tap do |path|
          data = {
            locale => {
              'lookups' => {
                lookup_name => {
                  'yes' => 'Sí'
                }
              }
            }
          }
          File.write(path, data.to_yaml)
        end
      end

      subject(:importer) { described_class.new(file_name: lookup_yaml_path) }

      it 'applies the new translated label to the lookup option' do
        importer.import

        lookup.reload
        option = lookup.lookup_options.first

        expect(option.data.label).to include('en' => 'Yes', 'es' => 'Sí')
      end
    end

    context 'for screen translations' do
      let(:screen_id) { 'test_screen' }
      let!(:app_flow) { AppFlow.create!(data: { unique_id: 'test_flow' }) }
      let!(:screen) do
        Screen.create_or_update(
          app_flow_id: 'test_flow',
          id: screen_id,
          component: 'TextArea',
          title: { text: { 'en' => 'Hello' } },
          description: { text: { 'en' => 'Desc' } },
          flow: { label_next: { 'en' => 'Next' } },
          fields: [
            { field_id: 'f1', slot: '1', label: { 'en' => 'Field 1' } }
          ]
        )
        Screen.find_by("data ->> 'id' = ?", screen_id)
      end

      let(:screen_yaml_path) do
        File.join(export_directory, "#{screen_id}.yml").tap do |path|
          data = {
            locale => {
              'screens' => {
                screen_id => {
                  'title' => { 'text' => 'Hola' },
                  'description' => { 'text' => 'Descripción' },
                  'flow' => { 'label_next' => 'Siguiente' },
                  'fields' => {
                    '1' => { 'label' => 'Campo 1' }
                  }
                }
              }
            }
          }
          File.write(path, data.to_yaml)
        end
      end

      subject(:importer) { described_class.new(file_name: screen_yaml_path) }

      it 'applies the new translated text deep inside nested JSON properties' do
        importer.import

        screen.reload
        expect(screen.data.title.text).to include('en' => 'Hello', 'es' => 'Hola')
        expect(screen.data.description.text).to include('en' => 'Desc', 'es' => 'Descripción')
        expect(screen.data.flow.label_next).to include('en' => 'Next', 'es' => 'Siguiente')

        field = screen.data.fields.first
        expect(field.label).to include('en' => 'Field 1', 'es' => 'Campo 1')
      end
    end
  end
end
