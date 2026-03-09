# frozen_string_literal: true

require 'rails_helper'

describe Api::RecordsController, type: :request do
  # include ActiveJob::TestHelper

  describe 'POST /api/records' do
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

    describe 'API rate limiting' do
      it 'throttles POST requests after 10 attempts per minute per IP' do
        11.times { post '/api/records', params:, headers: { 'X-Forwarded-For' => '8.8.8.8' } }
        expect(response).to have_http_status(429)

        post '/api/records', params:, headers: { 'X-Forwarded-For' => '192.168.1.2' }
        expect(response).to have_http_status(204)
      end
    end
  end
end
