# frozen_string_literal: true

require 'rails_helper'

describe Api::RecordsController, type: :request do
  include ActiveJob::TestHelper

  before do
    AppFlow.destroy_all
    Screen.destroy_all
    Lookup.destroy_all
  end

  describe 'POST /api/records' do
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

    let!(:lookup_risk_level) do
      Lookup.create!(
        name: 'risk_level',
        lookup_options: [
          Lookup::Option.new(data: { value: 'high', label_i18n: { en: 'High' } }),
          Lookup::Option.new(data: { value: 'medium', label_i18n: { en: 'Medium' } }),
          Lookup::Option.new(data: { value: 'low', label_i18n: { en: 'Low' } })
        ]
      )
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

    let!(:screens) do
      [
        Screen.create!(
          app_flow:,
          data: {
            id: 'screen1',
            bg_color: '#1D1DC2',
            component: 'MultiSelect',
            fields: [{ slot: 'input_1', scope: 'global', backend_id: 'sex', lookup_id: 'gender' }],
            title: { text_i18n: { en: 'Screen 1' } }
          }
        ),
        Screen.create!(
          app_flow:,
          data: {
            id: 'screen2',
            bg_color: '#1D1DC2',
            component: 'TextInput',
            fields: [{ slot: 'input_1', scope: 'record', backend_id: 'name' }],
            title: { text_i18n: { en: 'Screen 2' } }
          }
        ),
        Screen.create!(
          app_flow:,
          data: {
            id: 'screen2',
            bg_color: '#1D1DC2',
            component: 'TextInput',
            type: Screen::Field::NUMBER,
            fields: [{ slot: 'input_1', scope: 'record', backend_id: 'age' }],
            title: { text_i18n: { en: 'Screen 2' } }
          }
        )
      ]
    end

    let(:params) do
      {
        record_type: 'case',
        data: {
          name: 'Test',
          module_id: 'primeromodule-cp',
          age: 10,
          sex: 'male',
          risk_level: 'high'
        }
      }
    end

    let(:json) { JSON.parse(response.body) }

    describe 'API rate limiting' do
      it 'throttles POST requests after 10 attempts per minute per IP' do
        11.times { post '/api/records', params:, headers: { 'X-Forwarded-For' => '8.8.8.8' } }
        expect(response).to have_http_status(429)

        post '/api/records', params:, headers: { 'X-Forwarded-For' => '9.9.9.9' }
        expect(response).to have_http_status(204)
      end
    end

    describe 'post /api/records' do
      it 'enqueues a job to create a record and return 200' do
        post '/api/records', params: params

        expect(response).to have_http_status(204)
        expect(PrimeroSyncJob).to have_been_enqueued.with(
          record_type: 'case',
          data: { module_id: 'primeromodule-cp', risk_level: 'high', name: 'Test', age: '10' }
        )
      end

      it 'does not enqueue a job and returns 422 for invalid record type' do
        post '/api/records', params: params.merge(record_type: 'invalid_type')

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['detail']).to match_array(['/record_type'])
        expect(PrimeroSyncJob).not_to have_been_enqueued
      end

      it 'does not enqueue a job and returns 422 for missing module_id' do
        post '/api/records', params: params.merge(data: params[:data].except(:module_id))

        expect(response).to have_http_status(422)
        expect(json['errors'][0]['message']).to eq(
          'param is missing or the value is empty or invalid: module_id'
        )
        expect(PrimeroSyncJob).not_to have_been_enqueued
      end

      context 'when the lookup assignment_users is not defined' do
        it 'refuses to create a record with owned_by and returns 422' do
          post '/api/records', params: params.merge(data: params[:data].merge({ owned_by: 'user' }))

          expect(response).to have_http_status(422)
          expect(json['errors'][0]['detail']).to match_array(['/data/owned_by'])
          expect(PrimeroSyncJob).not_to have_been_enqueued
        end

        it 'refuses to create a record with a null owned_by and returns 422' do
          post '/api/records', params: params.merge(data: params[:data].merge({ owned_by: nil }))

          expect(response).to have_http_status(422)
          expect(json['errors'][0]['detail']).to match_array(['/data/owned_by', '/data/owned_by'])
          expect(PrimeroSyncJob).not_to have_been_enqueued
        end
      end

      context 'when the lookup assignment_users is defined' do
        before do
          Lookup.create!(
            name: 'assignment_users',
            lookup_options: [Lookup::Option.new(data: { value: 'user1', label_i18n: { en: 'User 1' } })]
          )
        end

        it 'refuses to create a record for a non-existent owned_by' do
          post '/api/records', params: params.merge(data: params[:data].merge({ owned_by: 'user' }))

          expect(response).to have_http_status(422)
          expect(json['errors'][0]['detail']).to match_array(['/data/owned_by'])
          expect(PrimeroSyncJob).not_to have_been_enqueued
        end

        it 'enqueues a job to create a record and return 200 for valid owned_by' do
          post '/api/records', params: params.merge(data: params[:data].merge({ owned_by: 'user1' }))

          expect(response).to have_http_status(204)
          expect(PrimeroSyncJob).to have_been_enqueued.with(
            record_type: 'case',
            data: { module_id: 'primeromodule-cp', owned_by: 'user1', risk_level: 'high', name: 'Test', age: '10' }
          )
        end
      end

      context 'when captcha is enabled' do
        before do
          allow(PrimeroKiosk::Application.config).to receive(:captcha_enabled).and_return(true)
        end

        it 'refuses to create a record without a captcha token' do
          post '/api/records', params: params

          expect(response).to have_http_status(422)
          expect(json['errors'][0]['message']).to eq(
            'param is missing or the value is empty or invalid: captcha_token'
          )
          expect(PrimeroSyncJob).not_to have_been_enqueued
        end

        it 'enqueues a job to create a record and return 200 for valid captcha token' do
          post '/api/records', params: params.merge(captcha_token: 'some-captcha-token')

          expect(response).to have_http_status(204)
          expect(PrimeroSyncJob).to have_been_enqueued.with(
            record_type: 'case',
            data: { module_id: 'primeromodule-cp', risk_level: 'high', name: 'Test', age: '10' }
          )
        end
      end
    end
  end
end
