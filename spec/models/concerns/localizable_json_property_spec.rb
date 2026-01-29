# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe LocalizableJsonProperty do
  before do
    class LocalizableTestModel # rubocop:disable Lint/ConstantDefinitionInBlock
      include ActiveModel::Model
      include ActiveModel::Attributes
      include LocalizableJsonProperty

      attribute :label_i18n, default: {}
      attribute :placeholder_i18n, default: {}

      localize_jsonb_properties %i[label placeholder]
    end
  end

  after do
    Object.send(:remove_const, :LocalizableTestModel)
  end

  let(:model) { LocalizableTestModel }

  describe '.localize_jsonb_properties' do
    it 'creates getter and setter methods for localized properties' do
      instance = model.new
      expect(instance).to respond_to(:label)
      expect(instance).to respond_to(:label=)
      expect(instance).to respond_to(:placeholder)
      expect(instance).to respond_to(:placeholder=)
    end

    it 'stores values in the i18n hash with locale keys' do
      instance = model.new
      I18n.with_locale(:en) do
        instance.label = 'English Label'
        expect(instance.label_i18n['en']).to eq('English Label')
      end
    end

    it 'retrieves values from the i18n hash by current locale' do
      instance = model.new(label_i18n: { 'en' => 'English', 'es' => 'Español' })

      I18n.with_locale(:en) do
        expect(instance.label).to eq('English')
      end
      I18n.with_locale(:es) do
        expect(instance.label).to eq('Español')
      end
    end

    it 'handles multiple locales' do
      instance = model.new
      I18n.with_locale(:en) { instance.label = 'English' }
      I18n.with_locale(:es) { instance.label = 'Español' }
      I18n.with_locale(:fr) { instance.label = 'Français' }

      expect(instance.label_i18n).to eq({ 'en' => 'English', 'es' => 'Español', 'fr' => 'Français' })
    end

    it 'works with multiple properties' do
      instance = model.new
      I18n.with_locale(:en) do
        instance.label = 'Label'
        instance.placeholder = 'Placeholder'
      end

      expect(instance.label_i18n).to eq({ 'en' => 'Label' })
      expect(instance.placeholder_i18n).to eq({ 'en' => 'Placeholder' })
    end

    it 'returns fallback for missing locale' do
      instance = model.new(label_i18n: { 'en' => 'English' })
      I18n.with_locale(:fr) do
        expect(instance.label).to be('English')
      end
    end

    it 'initializes with empty hash by default' do
      instance = model.new
      expect(instance.label_i18n).to eq({})
      expect(instance.placeholder_i18n).to eq({})
    end

    it 'overwrites existing value for locale' do
      instance = model.new(label_i18n: { 'en' => 'Old' })
      I18n.with_locale(:en) do
        instance.label = 'New'
        expect(instance.label).to eq('New')
      end
    end

    it 'preserves other i18n entries when setting one locale' do
      instance = model.new(label_i18n: { 'en' => 'English', 'es' => 'Español' })
      I18n.with_locale(:fr) do
        instance.label = 'Français'
      end

      expect(instance.label_i18n).to include('en' => 'English', 'es' => 'Español', 'fr' => 'Français')
    end
  end
end
