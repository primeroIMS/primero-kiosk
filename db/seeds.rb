# frozen_string_literal: true

[
  {
    name: 'what_will_make_you_happy',
    lookup_options_attributes: [
      { data: { value: 'talk', label_i18n: { 'en' => 'Talk to someone' } } },
      { data: { value: 'less_homework', label_i18n: { 'en' => 'Less homework' } } },
      { data: { value: 'ice_cream', label_i18n: { 'en' => 'Some ice cream would be nice' } } },
      { data: { value: 'fun', label_i18n: { 'en' => 'Some fun' } } },
      { data: { value: 'food', label_i18n: { 'en' => 'Food' } } }
    ]
  },
  {
    name: 'yes_no',
    lookup_options_attributes: [
      { data: { value: 'yes', label_i18n: { 'en' => 'Yes' } } },
      { data: { value: 'no', label_i18n: { 'en' => 'No' } } }
    ]
  }
].map do |lk|
  Lookup.create_or_update(lk)
end

[
  {
    id: 'flow_1',
    bg_color: '#072B36',
    component: 'LanguageSelect',
    fields: [
      {
        field_id: 'input_1',
        scope: 'global',
        placeholder_i18n: { 'en' => 'Choose your language' },
        label_i18n: { 'en' => 'Options' },
        record_definition: 'record-def-id'
      }
    ],
    title: {
      text_i18n: { 'en' => 'Choose your language' },
      color: '#1D86A3'
    },
    description: {
      text_i18n: { 'en' => 'Please choose one of the following options to proceed.' },
      color: '#FFFFFF'
    },
    flow: {
      allow_skip: true,
      allow_back: true,
      next_screen: {
        conditions: [
          { eq: { 'input_1' => 'es' }, path: 'flow_3' }
        ],
        default: 'flow_1'
      },
      label_i18n: { 'en' => 'Next' }
    }
  },
  {
    id: 'flow_2',
    bg_color: '#1DC24F',
    component: 'SingleSelect',
    fields: [
      {
        field_id: 'input_1',
        scope: 'record',
        backend_id: 'option_select',
        placeholder_i18n: { 'en' => 'Select an option' },
        label_i18n: { 'en' => 'Options' },
        record_definition: 'record-def-id',
        lookup: 'yes_no'
      }
    ],
    options: {
      text_color: '#000000',
      bg_color: '#FFFFFF',
      border_color: '#CCCCCC'
    },
    title: {
      text_i18n: { 'en' => 'Select an option' },
      color: '#1D86A3'
    },
    description: {
      text_i18n: { 'en' => 'Please choose one of the following options to proceed.' },
      color: '#FFFFFF'
    },
    flow: {
      allow_skip: true,
      allow_back: true,
      next_screen: {
        default: 'flow_3'
      },
      label_next_i18n: { 'en' => 'Next' },
      label_skip_i18n: { 'en' => 'Skip' }
    }
  },
  {
    id: 'flow_3',
    bg_color: '#1D1DC2',
    component: 'ResponseGoodBye',
    fields: [],
    title: {
      text_i18n: { 'en' => 'GoodBye' },
      color: '#1D86A3'
    },
    description: {
      text_i18n: { 'en' => 'Thank you for your participation.' },
      color: '#FFFFFF'
    },
    flow: {
      allow_skip: false,
      allow_back: true,
      end_of_flow: true
    }
  }
].each do |flow|
  Screen.where("data ->> 'id' = ?", flow[:id]).first_or_initialize.tap do |s|
    s.data = flow
    s.save!
  end
end

system_settings = SystemSettings.current
system_settings.starting_screen_id = 'flow_1'
system_settings.record_definitions = [{ id: 'record-def-id', type: 'case', module_id: 'module-id' }]
system_settings.save!
