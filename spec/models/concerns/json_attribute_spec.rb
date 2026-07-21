# frozen_string_literal: true

require 'rails_helper'

RSpec.describe JsonAttribute, type: :model do
  let(:test_class) do
    Class.new do
      include JsonAttribute

      attr_accessor :data
    end
  end

  subject { test_class.new }

  describe 'JSON attribute handling' do
    it 'stores JSON data' do
      subject.data = { key: 'value' }
      expect(subject.data).to eq({ key: 'value' })
    end

    it 'serializes to JSON' do
      subject.data = { name: 'test' }
      expect(subject.data.to_json).to include('test')
    end
  end
end
