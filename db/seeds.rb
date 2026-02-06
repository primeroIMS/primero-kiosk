# frozen_string_literal: true

return unless Rails.env.development?

Rake::Task['db:truncate_all'].execute

def build_lookup_option(value:, label:, icon_filename: nil)
  option = LookupOption.new(data: { value: value, label_i18n: { en: label } })

  option.icon.attach(
    io: File.open(Rails.root.join('db', 'seed_resources', icon_filename)),
    filename: icon_filename,
    content_type: 'image/svg+xml'
  )
  option
end

[
  {
    name: 'what_will_make_you_happy',
    lookup_options: [
      build_lookup_option(value: 'talk', label: 'Talk to someone 3', icon_filename: 'sad.svg'),
      build_lookup_option(value: 'less_homework', label: 'Less homework', icon_filename: 'angry.svg'),
      build_lookup_option(value: 'ice_cream', label: 'Some ice cream would be nice',
                          icon_filename: 'smile.svg'),
      build_lookup_option(value: 'fun', label: 'Some fun', icon_filename: 'surprised.svg'),
      build_lookup_option(value: 'food', label: 'Food', icon_filename: 'confused.svg')
    ]
  },
  {
    name: 'talk_about',
    lookup_options: [
      build_lookup_option(value: 'ice_cream', label: 'Some ice cream would be nice',
                          icon_filename: 'smile.svg'),
      build_lookup_option(value: 'fun', label: 'Some fun', icon_filename: 'surprised.svg'),
      build_lookup_option(value: 'food', label: 'Food', icon_filename: 'confused.svg')
    ]
  },
  {
    name: 'yes_no',
    lookup_options: [
      build_lookup_option(value: 'yes', label: 'Yes', icon_filename: 'check.svg'),
      build_lookup_option(value: 'no', label: 'No', icon_filename: 'cross.svg')
    ]
  }
].map do |lk|
  Lookup.create_or_update(lk)
end

Screen.create!(
  data: {
    id: 'character',
    bg_color: '#FA7E87',
    component: 'CharacterSelection',
    fields: [
      {
        field_id: 'input_1',
        scope: 'global',
        backend_id: 'character',
        lookup: 'what_will_make_you_happy'
      }
    ],
    options: {
      text_color: '#000000',
      bg_color: '#FFFFFF',
      border_color: '#CCCCCC'
    },
    title: {
      text_i18n: { en: 'Select an character' },
      color: '#f44336'
    },
    flow: {
      next_screen: {
        default: 'hub_with_character'
      }
    }
  }
)

Screen.create!(
  data: {
    id: 'hub_with_character',
    bg_color: '#FA7E87',
    component: 'HubWithCharacter',
    fields: [
      {
        field_id: 'input_1',
        scope: 'records',
        backend_id: 'hub_with_character',
        lookup: 'talk_about'
      }
    ],
    options: {
      text_color: '#000000',
      bg_color: '#FFFFFF',
      border_color: '#CCCCCC'
    },
    title: {
      text_i18n: { en: 'What would you like to talk about' },
      color: '#f44336'
    },
    description: {
      text_i18n: { en: 'Let\'s talk about it' },
      color: '#f44336'
    },
    flow: {
      next_screen: {
        default: 'hub'
      }
    }
  }
)

Screen.create!(
  data: {
    id: 'hub',
    bg_color: '#FA7E87',
    component: 'Hub',
    fields: [
      {
        field_id: 'input_1',
        scope: 'records',
        backend_id: 'hub',
        lookup: 'talk_about'
      }
    ],
    options: {
      text_color: '#000000',
      bg_color: '#FFFFFF',
      border_color: '#CCCCCC'
    },
    title: {
      text_i18n: { en: 'What would you like to talk about' },
      color: '#f44336'
    },
    description: {
      text_i18n: { en: 'Let\'s talk about it' },
      color: '#f44336'
    },
    flow: {
      next_screen: {
        default: 'language'
      }
    }
  }
)

Screen.create!(
  data: {
    id: 'language',
    bg_color: '#072B36',
    component: 'LanguageSelect',
    fields: [
      {
        field_id: 'input_1',
        scope: 'global',
        placeholder_i18n: { en: 'Choose your language', ar: 'اختر لغتك', es: 'Elige tu idioma' },
        label_i18n: { en: 'Options' },
        record_definition: 'record-def-id'
      }
    ],
    title: {
      text_i18n: { en: 'Choose your language', ar: 'اختر لغتك', es: 'Elige tu idioma' },
      color: '#1D86A3'
    },
    description: {
      text_i18n: { en: 'Please choose one of the following options to proceed.' },
      color: '#FFFFFF'
    },
    flow: {
      allow_skip: true,
      allow_back: false,
      next_screen: {
        conditions: [
          { eq: { 'global.language' => 'en' }, path: 'singleselect' }
        ],
        default: 'selectwithtextarea'
      },
      label_i18n: { en: 'Next' }
    }
  }
)

Screen.create!(
  data: {
    id: 'singleselect',
    bg_color: '#1DC24F',
    component: 'SingleSelect',
    fields: [
      {
        field_id: 'input_1',
        scope: 'records',
        backend_id: 'option_select',
        placeholder_i18n: { en: 'Select an option' },
        label_i18n: { en: 'Options' },
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
      text_i18n: { en: 'Select an option' },
      color: '#1D86A3'
    },
    description: {
      text_i18n: { en: 'Please choose one of the following options to proceed.' },
      color: '#FFFFFF'
    },
    flow: {
      allow_skip: true,
      allow_back: true,
      next_screen: {
        default: 'selectwithtextarea'
      },
      label_next_i18n: { en: 'Next' },
      label_skip_i18n: { en: 'Skip' }
    }
  }
)

Screen.create!(
  data: {
    id: 'selectwithtextarea',
    bg_color: '#072B36',
    component: 'SelectWithTextArea',
    fields: [
      {
        field_id: 'input_1',
        scope: 'records',
        backend_id: 'tell_us',
        placeholder_i18n: { en: 'Select an option' },
        label_i18n: { en: 'What is your favorite color?' },
        record_definition: 'record-def-id',
        lookup: 'what_will_make_you_happy'
      },
      {
        field_id: 'input_2',
        scope: 'records',
        backend_id: 'more',
        placeholder_i18n: { en: 'Age' },
        label_i18n: { en: 'What is your age' },
        record_definition: 'record-def-id'
      }
    ],
    title: {
      text_i18n: { en: 'Tell us about yourself', es: 'Cuéntanos sobre ti' },
      color: '#1D86A3'
    },
    description: {
      text_i18n: { en: 'Tell us some information about yourself.', es: 'Cuéntanos algo sobre ti.' },
      color: '#FFFFFF'
    },
    flow: {
      allow_skip: true,
      allow_back: true,
      next_screen: {
        conditions: [
          { eq: { 'input_1' => 'green' }, path: 'flow_2' }
        ],
        default: 'multiselect'
      },
      label_i18n: { en: 'Next' }
    }
  }
)

Screen.create!(
  data: {
    id: 'multiselect',
    bg_color: '#1D1DC2',
    component: 'MultiSelect',
    fields: [
      {
        field_id: 'input_1',
        scope: 'record',
        backend_id: 'multi_select_tell_us',
        record_definition: 'record-def-id',
        lookup: 'what_will_make_you_happy'
      },
      {
        field_id: 'input_2',
        scope: 'records',
        backend_id: 'multi_select_more',
        record_definition: 'record-def-id'
      }
    ],
    title: {
      text_i18n: { en: 'GoodBye' },
      color: '#1D86A3'
    },
    description: {
      text_i18n: { en: 'Thank you for your participation.' },
      color: '#FFFFFF'
    },
    flow: {
      allow_skip: false,
      allow_back: true,
      end_of_flow: false,
      next_screen: {
        default: 'textarea'
      }
    }
  }
)

Screen.create!(
  data: {
    id: 'textarea',
    bg_color: '#1D1DC2',
    component: 'TextArea',
    fields: [
      {
        field_id: 'input_1',
        scope: 'record',
        backend_id: 'textarea_tell_us',
        placeholder_i18n: { en: 'Select an option' },
        label_i18n: { en: 'What is your favorite color?' },
        record_definition: 'record-def-id'
      }
    ],
    title: {
      text_i18n: { en: 'GoodBye' },
      color: '#1D86A3'
    },
    description: {
      text_i18n: { en: 'Thank you for your participation.' },
      color: '#FFFFFF'
    },
    flow: {
      allow_skip: false,
      allow_back: true,
      end_of_flow: false,
      next_screen: {
        default: 'goodbye'
      }
    }
  }
)

Screen.create!(
  data: {
    id: 'goodbye',
    bg_color: '#1D1DC2',
    component: 'ResponseGoodBye',
    fields: [],
    title: {
      text_i18n: { en: 'GoodBye' },
      color: '#1D86A3'
    },
    description: {
      text_i18n: { en: 'Thank you for your participation.' },
      color: '#FFFFFF'
    },
    flow: {
      allow_skip: false,
      allow_back: true,
      end_of_flow: true
    }
  }
)

system_settings = SystemSettings.current
system_settings.starting_screen_id = 'character'
system_settings.record_definitions = [{ id: 'record-def-id', type: 'case', module_id: 'module-id' }]
system_settings.save!
