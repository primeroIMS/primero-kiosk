# frozen_string_literal: true

require 'rails_helper'

RSpec.describe JsonNestedModel, type: :concern do
  before do
    class NestedTestModel # rubocop:disable Lint/ConstantDefinitionInBlock
      include JsonNestedModel

      attribute :name

      validates :name, presence: true
    end

    class ParentTestModel # rubocop:disable Lint/ConstantDefinitionInBlock
      include JsonNestedModel

      attribute_hash :profile, NestedTestModel
      attribute_array :items, NestedTestModel
    end
  end

  after do
    Object.send(:remove_const, :NestedTestModel)
    Object.send(:remove_const, :ParentTestModel)
  end

  let(:nested_model) { NestedTestModel }
  let(:parent_model) { ParentTestModel }

  describe '.attribute_hash' do
    it 'initializes with default empty hash' do
      instance = parent_model.new
      expect(instance.profile).to be_a(nested_model)
    end

    it 'converts hash to nested model instance' do
      instance = parent_model.new(profile: { name: 'John' })
      expect(instance.profile).to be_a(nested_model)
      expect(instance.profile.name).to eq('John')
    end

    it 'accepts nested model instance directly' do
      nested = nested_model.new(name: 'Jane')
      instance = parent_model.new(profile: nested)
      expect(instance.profile).to be(nested)
    end

    it 'validates nested model and adds prefixed errors' do
      instance = parent_model.new(profile: {})
      expect(instance.valid?).to be false
      expect(instance.errors['profile.name']).to include("can't be blank")
    end

    it 'handles nil values' do
      instance = parent_model.new(profile: nil)
      expect(instance.profile).to be_a(nested_model)
    end

    it 'updates nested model attributes' do
      instance = parent_model.new(profile: { name: 'John' })
      instance.profile.name = 'Jane'
      expect(instance.profile.name).to eq('Jane')
    end

    it 'reports multiple validation errors on nested model' do
      nested_model.validates :name, presence: true, length: { minimum: 3 }
      instance = parent_model.new(profile: { name: 'Jo' })
      expect(instance.valid?).to be false
      expect(instance.errors[:'profile.name'].length).to eq(1)
    end

    it 'replaces nested model when reassigned' do
      nested1 = nested_model.new(name: 'John')
      nested2 = nested_model.new(name: 'Jane')
      instance = parent_model.new(profile: nested1)
      instance.profile = nested2
      expect(instance.profile).to be(nested2)
    end
  end

  describe '.attribute_array' do
    it 'initializes with default empty array' do
      instance = parent_model.new
      expect(instance.items).to eq([])
      expect(instance.items).to be_a(Array)
    end

    it 'converts array of hashes to nested model instances' do
      instance = parent_model.new(items: [{ name: 'Item1' }, { name: 'Item2' }])
      expect(instance.items.length).to eq(2)
      expect(instance.items.all? { |i| i.is_a?(nested_model) }).to be true
    end

    it 'validates each item and adds indexed errors' do
      instance = parent_model.new(items: [{ name: 'Valid' }, {}])
      expect(instance.valid?).to be false
      expect(instance.errors[:'items[1].name']).to include("can't be blank")
    end

    it 'handles nil values' do
      instance = parent_model.new(items: nil)
      expect(instance.items).to be_a(Array)
      expect(instance.items).to be_empty
    end

    it 'handles empty array' do
      instance = parent_model.new(items: [])
      expect(instance.items).to eq([])
    end

    it 'updates items in array' do
      instance = parent_model.new(items: [{ name: 'Item1' }])
      instance.items[0].name = 'Updated'
      expect(instance.items[0].name).to eq('Updated')
    end

    it 'allows adding new items to array' do
      instance = parent_model.new(items: [])
      instance.items << nested_model.new(name: 'NewItem')
      expect(instance.items.length).to eq(1)
    end

    it 'validates all items are instances of the correct class' do
      instance = parent_model.new(items: [{ name: 'Valid' }, { name: 'Valid2' }])
      expect(instance.items.all? { |i| i.is_a?(nested_model) }).to be true
    end
  end
end
