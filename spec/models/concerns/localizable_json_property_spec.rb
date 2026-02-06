# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe LocalizableJsonProperty do
  before do
    class LocalizableTestModel # rubocop:disable Lint/ConstantDefinitionInBlock
      include ActiveModel::Model
      include ActiveModel::Attributes
      include LocalizableJsonProperty

      attribute :label, default: {}
      attribute :placeholder, default: {}

      localize_jsonb_properties %i[label placeholder]
    end
  end

  after do
    Object.send(:remove_const, :LocalizableTestModel)
  end

  let(:model) { LocalizableTestModel }

  describe '.localize_jsonb_properties' do
    it 'creates setter methods for localized properties' do
      instance = model.new
      expect(instance).to respond_to(:label_i18n=)
      expect(instance).to respond_to(:placeholder_i18n=)
    end

    it 'stores values in the i18n hash with locale keys' do
      instance = model.new(label_i18n: { 'en' => 'English Label', 'fr' => 'French Label' })
      expect(instance.label).to include({ 'en' => 'English Label', 'fr' => 'French Label' })
    end

    it 'works with multiple properties' do
      instance = model.new({ label_i18n: { 'en' => 'Label' }, placeholder_i18n: { 'en' => 'Placeholder' } })

      expect(instance.label).to include({ 'en' => 'Label' })
      expect(instance.placeholder).to include({ 'en' => 'Placeholder' })
    end

    it 'returns fallback for missing locale' do
      instance = model.new(label_i18n: { 'en' => 'English' })
      expect(instance.label[:fr]).to be('English')
    end

    it 'initializes with empty hash by default' do
      instance = model.new
      expect(instance.label).to eq({})
      expect(instance.placeholder).to eq({})
    end
  end
end
