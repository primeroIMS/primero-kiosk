import { I18nLocale } from "./translations";

export type AppFlow = {
    handle: string;
    logo: string;
    logo_pictorial: string;
    logo_pictorial_secondary: string;
    meta: Meta;
    record_definitions: AppFlowRecordDefinition[];
    screens: Screen[];
    starting_screen_id: string;
};

export type AppFlowRecordDefinition = {
    id: string;
    module_id: string;
    type: string;
};

export type FormValueRecord = {
    [key: string]: unknown;
    module_id: string;
    record_type: string;
};

export type FormValues = {
    global: Record<string, unknown>;
    kiosk: Record<string, unknown>;
    recordIndex: number;
    records: FormValueRecord[];
};

export type I18nTranslation = Record<I18nLocale, string>;

export type Lookup = {
    id: string;
    options: LookupOption[];
};

export type LookupOption = {
    description?: I18nTranslation;
    icon?: string;
    label: I18nTranslation;
    meta: Meta;
    value: string;
};

export type Meta = {
    bg_color?: string;
    bg_selected_color?: string;
    border_color?: string;
    border_selected_color?: string;
    order: number;
    text_color?: string;
    text_selected_color?: string;
};

export type Path<T> = T extends (infer U)[]
    ? `${number}.${Path<U>}` | `${number}`
    : T extends object
      ? {
            [K in keyof T & string]: `${K}.${Path<T[K]>}` | `${K}`;
        }[keyof T & string]
      : never;

export type PathValue<T, P extends string> = P extends `${infer K}.${infer R}`
    ? K extends keyof T
        ? PathValue<T[K], R>
        : never
    : P extends keyof T
      ? T[P]
      : never;

export type Primitive = boolean | null | number | string | undefined;

export type PrimitiveRecord = Record<string, Primitive>;

export type Screen = {
    bg_color?: string;
    button: Meta;
    character_lookup_id?: string;
    component: ScreenComponent;
    description?: {
        color?: string;
        text: I18nTranslation;
    };
    featured_image?: string;
    fields: ScreenField[];
    flow: ScreenFlow;
    id: string;
    logo_secondary?: boolean;
    options: Meta;
    show_character?: boolean;
    start_new_record?: boolean;
    title: {
        color?: string;
        text: I18nTranslation;
    };
};

export type ScreenComponent =
    | "CharacterInformation"
    | "CharacterSelection"
    | "CharacterWelcome"
    | "ComfortingResponse"
    | "Hub"
    | "HubWelcome"
    | "HubWithCharacter"
    | "LanguageSelect"
    | "MultiSelect"
    | "MultiSelectOrWrite"
    | "ResponseGoodBye"
    | "SelectOrWrite"
    | "SingleSelect"
    | "TextArea";

export type ScreenConfig = { appFlow: AppFlow; screen: Screen };

export type ScreenField = {
    backend_id: string;
    label?: I18nTranslation;
    lookup?: string;
    placeholder?: I18nTranslation;
    record_definition?: string;
    scope: ScreenFieldScope;
    slot: string;
    type: string; // Todo add types when building user info screen
};

export type ScreenFieldScope = "global" | "kiosk" | "records";

export type ScreenFlow = {
    allow_back?: boolean;
    allow_exit?: boolean;
    allow_skip?: boolean;
    end_of_flow?: boolean;
    label_back?: I18nTranslation;
    label_next?: I18nTranslation;
    label_skip?: I18nTranslation;
    next_screen?: {
        conditions?: Array<{ eq: Record<string, any>; path: string }>;
        default: string;
    };
    record_definition_id?: string;
    start_new_record?: boolean;
};

export type SystemSettings = {
    default_locale: I18nLocale;
    locale: I18nLocale;
    locales: I18nLocale[];
    rtl_locales: I18nLocale[];
};

export type Theme = {
    colors: Record<string, string>;
    copy: Record<string, I18nTranslation>;
    kiosk_name: string;
    site_description: I18nTranslation;
    site_title: string;
};

export type UseScreenArgs = {
    config: ScreenConfig;
    onNext?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onSubmit?: (data: FormValueRecord | FormValues) => void;
    shouldComputeNextScreen?: boolean;
};

export type UseScreenReturn = {
    button: Meta;
    fieldProp: (id: string, prop: keyof ScreenField, defaultValue?: any) => any;
    flow: ScreenFlow;
    name: (id: string, name?: string) => string;
    nextScreenId: (data: FormValueRecord) => string;
    onNext: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onSubmit: (data: FormValueRecord) => void;
    submitToRemote: () => void;
};
