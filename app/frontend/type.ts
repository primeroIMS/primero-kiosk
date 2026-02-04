import { I18nLocale } from "./translations";

export type FormValues = {
    global?: Record<string, unknown>;
    records?: Record<string, unknown>[];
};

export type I18nTranslation = Record<I18nLocale, string>;

export type Lookup = {
    id: string;
    options: LookupOption[];
};

export type LookupOption = {
    description?: I18nTranslation;
    label: I18nTranslation;
    value: string;
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
    component: ScreenComponent;
    description?: {
        color?: string;
        text: I18nTranslation;
    };
    featured_image?: string;
    fields: ScreenField[];
    flow: {
        allow_back?: boolean;
        allow_skip?: boolean;
        end_of_flow?: boolean;
        label_back?: I18nTranslation;
        label_next?: I18nTranslation;
        label_skip?: I18nTranslation;
        next_screen?: {
            conditions?: Array<{ eq: Record<string, any>; path: string }>;
            default: string;
        };
    };
    id: string;
    options: {
        bg_color?: string;
        border_color?: string;
        text_color?: string;
    };
    show_character?: boolean;
    start_new_record?: boolean;
    title: {
        color?: string;
        text: I18nTranslation;
    };
};

export type ScreenComponent = "LanguageSelect" | "ResponseGoodBye" | "SingleSelect";

export type ScreenField = {
    backend_id: string;
    field_id: string;
    label?: I18nTranslation;
    lookup?: string;
    placeholder?: I18nTranslation;
    record_definition?: string;
    scope: ScreenFieldScope;
    type: string; // Todo add types when building user info screen
};

export type ScreenFieldScope = "global" | "records";

export type SystemSettings = {
    default_locale: I18nLocale;
    locale: I18nLocale;
    locales: I18nLocale[];
    record_definitions: SystemSettingsRecordDefinition[];
    rtl_locales: I18nLocale[];
    starting_screen_id: string;
};

export type SystemSettingsRecordDefinition = {
    id: string;
    module_id: string;
    type: string;
};

export type Theme = {
    colors: Record<string, string>;
    copy: Record<string, I18nTranslation>;
    kiosk_name: string;
    logo: string;
    logo_pictorial: string;
    site_description: I18nTranslation;
    site_title: string;
};
