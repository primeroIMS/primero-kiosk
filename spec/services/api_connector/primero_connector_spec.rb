# frozen_string_literal: true

require 'rails_helper'

describe ApiConnector::PrimeroConnector do
  let(:connection) { double('connection') }
  let(:primero_connector) do
    primero_connector = ApiConnector::PrimeroConnector.new
    primero_connector.connection = connection
    primero_connector
  end
  let(:record) { { 'data' => { 'module_id' => 'app-module-id', 'name' => 'some name' } } }
  let(:record_with_id) { record.merge('data' => record['data'].merge('id' => 'case-id')) }

  describe '.create' do
    it 'returns the created case' do
      expect(connection).to(
        receive(:post).with('/api/v2/cases', record).and_return([200, record_with_id])
      )
      result = primero_connector.create({ 'record_type' => 'case' }.merge(record))

      expect(result[:status]).to eq(200)
      expect(result[:response]).to eq(record_with_id)
    end

    it 'throws an exception for a non-successful status code' do
      expect(connection).to(
        receive(:post).with('/api/v2/cases', record).and_return([301, 'Moved permanently'])
      )

      expect do
        primero_connector.create({ 'record_type' => 'case' }.merge(record))
      end.to raise_error(ApiConnector::UnsuccessfulResponseError)
    end
  end
end
