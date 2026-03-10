# frozen_string_literal: true

require 'rails_helper'

describe PermittedFieldService do
  before do
    AppFlow.destroy_all
    Screen.destroy_all
    Lookup.destroy_all
  end

  let!(:lookup_gender) do
    Lookup.create!(
      name: 'gender',
      lookup_options: [
        Lookup::Option.new(data: { value: 'male', label_i18n: { en: 'Male' } }),
        Lookup::Option.new(data: { value: 'female', label_i18n: { en: 'Female' } })
      ]
    )
  end

  let!(:app_flow) do
    AppFlow.create!(
      data: {
        id: 'flow1',
        name: 'Flow 1',
        description: 'Flow 1 description',
        start_screen_id: 'screen1',
        record_definitions: [{
          id: 'def-1',
          type: 'case',
          module_id: 'moduledef-1',
          channel: { 'channel_field' => 'channel_1' }
        }]
      }
    )
  end

  let!(:screens) do
    [
      Screen.create!(
        app_flow:,
        data: {
          id: 'screen1',
          bg_color: '#1D1DC2',
          component: 'MultiSelect',
          fields: [{ slot: 'input_1', scope: 'global', backend_id: 'field1', lookup_id: 'gender' }],
          title: { text_i18n: { en: 'Screen 1' } }
        }
      ),
      Screen.create!(
        app_flow:,
        data: {
          id: 'screen2',
          bg_color: '#1D1DC2',
          component: 'TextInput',
          fields: [{ slot: 'input_1', scope: 'record', backend_id: 'field2' }],
          title: { text_i18n: { en: 'Screen 2' } }
        }
      )
    ]
  end

  describe '.permitted_fields' do
    it 'returns the permitted fields' do
      permitted_field_service = PermittedFieldService.instance

      expect(permitted_field_service.permitted_fields.map(&:backend_id)).to match_array(
        %w[owned_by risk_level protection_concerns module_id language field1 field2 channel_field]
      )
    end

    it 'field1 contains option_ids' do
      permitted_field_service = PermittedFieldService.instance

      expect(
        permitted_field_service.permitted_fields.find { |field| field.backend_id == 'field1' }.option_ids
      ).to match_array(%w[male female])
    end

    context 'when with_cache=true' do
      it 'returns the permitted field ids from cache' do
        permitted_field_service = PermittedFieldService.new(true)

        expect(permitted_field_service.permitted_fields.map(&:backend_id)).to match_array(
          %w[owned_by risk_level protection_concerns module_id language field1 field2 channel_field]
        )
      end
    end
  end
end
