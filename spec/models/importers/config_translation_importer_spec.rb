# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ConfigTranslationImporter do
  let(:export_directory) { Dir.mktmpdir }
  let(:locale) { 'es' }

  describe '#import' do
    before do
      allow(I18n).to receive(:available_locales).and_return(%i[en es ar tr])
    end

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

      it 'does not leak one imported locale into other locales' do
        ar_yaml_path = File.join(export_directory, 'lookups-ar.yml').tap do |path|
          data = {
            'ar' => {
              'lookups' => {
                lookup_name => {
                  'yes' => 'نعم'
                }
              }
            }
          }
          File.write(path, data.to_yaml)
        end

        tr_yaml_path = File.join(export_directory, 'lookups-tr.yml').tap do |path|
          data = {
            'tr' => {
              'lookups' => {
                lookup_name => {
                  'yes' => 'Evet'
                }
              }
            }
          }
          File.write(path, data.to_yaml)
        end

        described_class.new(file_name: ar_yaml_path).import
        described_class.new(file_name: tr_yaml_path).import

        lookup.reload
        label = lookup.lookup_options.first.data.label

        expect(label['en']).to eq('Yes')
        expect(label['ar']).to eq('نعم')
        expect(label['tr']).to eq('Evet')
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
        File.join(export_directory, 'test_flow.yml').tap do |path|
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

      it 'keeps locales isolated across multiple imports' do
        ar_yaml_path = File.join(export_directory, 'ar', 'test_flow.yml').tap do |path|
          FileUtils.mkdir_p(File.dirname(path))
          data = {
            'ar' => {
              'screens' => {
                screen_id => {
                  'title' => { 'text' => 'مرحبا' }
                }
              }
            }
          }
          File.write(path, data.to_yaml)
        end

        tr_yaml_path = File.join(export_directory, 'tr', 'test_flow.yml').tap do |path|
          FileUtils.mkdir_p(File.dirname(path))
          data = {
            'tr' => {
              'screens' => {
                screen_id => {
                  'title' => { 'text' => 'Merhaba' }
                }
              }
            }
          }
          File.write(path, data.to_yaml)
        end

        described_class.new(file_name: ar_yaml_path).import
        described_class.new(file_name: tr_yaml_path).import

        screen.reload
        expect(screen.data.title.text['en']).to eq('Hello')
        expect(screen.data.title.text['ar']).to eq('مرحبا')
        expect(screen.data.title.text['tr']).to eq('Merhaba')
      end

      it 'updates the screen scoped to the app flow filename when ids collide' do
        app_flow_a = AppFlow.create!(data: { unique_id: 'buddy-a' })
        app_flow_b = AppFlow.create!(data: { unique_id: 'buddy-b' })

        screen_a = Screen.create!(
          app_flow: app_flow_a,
          data: {
            id: 'language',
            component: 'TextArea',
            title: { text: { 'en' => 'Flow A title' } },
            flow: {}
          }
        )
        screen_b = Screen.create!(
          app_flow: app_flow_b,
          data: {
            id: 'language',
            component: 'TextArea',
            title: { text: { 'en' => 'Flow B title' } },
            flow: {}
          }
        )

        app_flow_file_path = File.join(export_directory, 'buddy-b.yml').tap do |path|
          data = {
            'ar' => {
              'screens' => {
                'language' => {
                  'title' => { 'text' => 'عنوان بادي بي' }
                }
              }
            }
          }
          File.write(path, data.to_yaml)
        end

        described_class.new(file_name: app_flow_file_path).import

        screen_a.reload
        screen_b.reload

        expect(screen_a.data.title.text['ar']).to be_nil
        expect(screen_b.data.title.text['ar']).to eq('عنوان بادي بي')
      end
    end
  end
end
