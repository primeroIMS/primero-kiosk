# frozen_string_literal: true

require 'rails_helper'

describe PermittedFieldService do
  before do
    @app_flow = AppFlow.create!(
      data: {
        id: 'flow1',
        name: 'Flow 1',
        description: 'Flow 1 description',
        start_screen_id: 'screen1'
      }
    )
  end

  after do
    AppFlow.destroy_all
    Screen.destroy_all
  end

  let!(:screens) do
    [
      Screen.create!(
        app_flow: @app_flow,
        data: {
          id: 'screen1',
          bg_color: '#1D1DC2',
          component: 'MultiSelect',
          fields: [
            { slot: 'input_1', scope: 'record', backend_id: 'field1' },
            { slot: 'input_2', scope: 'global', backend_id: 'field2' }
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
        app_flow: @app_flow,
        data: {
          id: 'screen2',
          bg_color: '#1D1DC2',
          component: 'MultiSelect',
          fields: [
            { slot: 'input_1', scope: 'record', backend_id: 'field3' }
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

      expect(permitted_field_service.permitted_field_ids).to eq([{ field1: [] }, { field2: [] }, { field3: [] },
                                                                 :owned_by,
                                                                 :risk_level, { protection_concerns: [] }])
    end

    context 'when with_cache=true' do
      it 'returns the permitted field ids from cache' do
        permitted_field_service = PermittedFieldService.new(true)

        expect(permitted_field_service.permitted_field_ids).to eq([{ field1: [] }, { field2: [] }, { field3: [] },
                                                                   :owned_by,
                                                                   :risk_level, { protection_concerns: [] }])
      end
    end
  end
end
