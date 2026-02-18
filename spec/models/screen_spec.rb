# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Screen, type: :model do
  before(:all) do
    @app_flow = AppFlow.create!
  end

  after(:all) do
    AppFlow.destroy_all
  end

  context 'validations' do
    it 'is valid with valid attributes' do
      screen = Screen.new(
        app_flow: @app_flow,
        data: {
          bg_color: '#FFFFFF',
          component: 'SingleSelect',
          fields: [
            { slot: 'field_1',
              scope: 'user.name',
              type: 'text' }
          ],
          title: {
            text_i18n: { en: 'Title in English' },
            color: '#000000'
          },
          description: {
            text_i18n: { en: 'Description Title' },
            color: '#FFFFFF'
          },
          flow: {
            allow_skip: 'yes',
            allow_back: 'no',
            next_screen: { default: 'flow-1' },
            end_of_flow: 'no'
          }
        }
      )
      expect(screen).to be_valid
    end

    it 'is invalid without data' do
      screen = Screen.new(app_flow: @app_flow)
      expect(screen.valid?).to be false
      expect(screen.errors).to be_present
    end

    it 'is invalid without component' do
      screen = Screen.new(data: { flow: {}, fields: [] }, app_flow: @app_flow)
      expect(screen.valid?).to be false
    end

    it 'is invalid when component type invalid' do
      screen = Screen.new(app_flow: @app_flow, data: { component: 'invalid_component', flow: {}, fields: [] })
      expect(screen.valid?).to be false
      expect(screen.errors['data.component']).to be_present
    end

    it 'is invalid without flow' do
      screen = Screen.new(app_flow: @app_flow, data: { component: 'form', fields: [] })
      expect(screen.valid?).to be false
    end

    it 'is invalid without fields' do
      screen = Screen.new(app_flow: @app_flow, data: { component: 'form', flow: {} })
      expect(screen.valid?).to be false
    end

    it 'is invalid with invalid hex color' do
      screen = Screen.new(
        app_flow: @app_flow,
        data: {
          bg_color: 'not-a-color',
          component: 'form',
          fields: [{ slot: 'f1', scope: 'user.name' }],
          flow: {}
        }
      )
      expect(screen.valid?).to be false
      expect(screen.errors['data.bg_color']).to be_present
    end
  end

  context 'persistence' do
    it 'saves and retrieves screen data correctly' do
      screen = Screen.create!(
        app_flow: @app_flow,
        data: {
          bg_color: '#FFFFFF',
          component: 'SingleSelect',
          title: {
            text_i18n: { en: 'Title', es: 'Título' }
          },
          fields: [
            { slot: 'field_1', scope: 'user.name', type: 'text' }
          ],
          flow: { allow_skip: 'yes' }
        }
      )

      retrieved = Screen.find(screen.id)
      expect(retrieved.data.bg_color).to eq('#FFFFFF')
      expect(retrieved.data.fields.length).to eq(1)
      expect(retrieved.data.fields[0].slot).to eq('field_1')
    end

    it 'preserves nested object instances across saves' do
      screen = Screen.create!(
        app_flow: @app_flow,
        data: {
          bg_color: '#FFFFFF',
          component: 'SingleSelect',
          title_i18n: { en: 'Title', es: 'Título' },
          fields: [{ slot: 'f1', scope: 'user.name' }],
          flow: {}
        }
      )

      screen.data.bg_color = '#000000'
      screen.save!

      expect(Screen.find(screen.id).data.bg_color).to eq('#000000')
    end
  end

  context 'field validation' do
    it 'reports nested field validation errors' do
      screen = Screen.new(
        app_flow: @app_flow,
        data: {
          bg_color: '#FFFFFF',
          component: 'form',
          fields: [{ scope: 'user.name' }],
          flow: {}
        }
      )
      expect(screen.valid?).to be false
      expect(screen.errors['data.fields[0].slot']).to be_present
    end

    it 'validates multiple fields independently' do
      screen = Screen.new(
        app_flow: @app_flow,
        data: {
          bg_color: '#FFFFFF',
          component: 'form',
          title_i18n: { en: 'Title', es: 'Título' },
          fields: [
            { slot: 'f1', scope: 'user.name' },
            { scope: 'invalid' }
          ],
          flow: {}
        }
      )
      expect(screen.valid?).to be false
      expect(screen.errors['data.fields[1].slot']).to be_present
    end
  end

  context 'localization' do
    it 'handles localized field properties' do
      screen = Screen.new(
        app_flow: @app_flow,
        data: {
          bg_color: '#FFFFFF',
          component: 'SingleSelect',
          fields: [
            {
              slot: 'f1',
              scope: 'user.name',
              label_i18n: { en: 'Name', es: 'Nombre' }
            }
          ],
          flow: {}
        }
      )
      expect(screen.data.fields[0].label).to include({ 'en' => 'Name', 'es' => 'Nombre' })
    end
  end
end
