# frozen_string_literal: true

require 'rails_helper'

describe PermittedFieldService do
  let!(:screens) do
    [
      Screen.create!(
        data: {
          id: 'screen1',
          bg_color: '#1D1DC2',
          component: 'MultiSelect',
          fields: [
            { field_id: 'input_1', scope: 'record', backend_id: 'field1' },
            { field_id: 'input_2', scope: 'global', backend_id: 'field2' }
          ],
          title: { text_i18n: { en: 'Screen 1' } },
          flow: {
            allow_skip: false,
            allow_back: true,
            end_of_flow: false,
            next_screen: { default: 'textarea' }
          }
        }
      ),
      Screen.create!(
        data: {
          id: 'screen2',
          bg_color: '#1D1DC2',
          component: 'MultiSelect',
          fields: [
            { field_id: 'input_1', scope: 'record', backend_id: 'field3' },
          ],
          title: { text_i18n: { en: 'Screen 1' } },
          flow: {
            allow_skip: false,
            allow_back: true,
            end_of_flow: false,
            next_screen: { default: 'textarea' }
          }
        }
      )
    ]
  end

  describe '.permitted_field_ids' do
    it 'returns the permitted field ids' do
      permitted_field_service = PermittedFieldService.instance

      expect(permitted_field_service.permitted_field_ids).to eq(%w[field1 field2 field3])
    end

    context 'when with_cache=true' do
      it 'returns the permitted field ids from cache' do
        permitted_field_service = PermittedFieldService.new(true)

        expect(permitted_field_service.permitted_field_ids).to eq(%w[field1 field2 field3])
      end
    end
  end
end
