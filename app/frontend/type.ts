export type Field = {};
export type Primitive = boolean | null | number | string | undefined;

export type PrimitiveRecord = Record<string, Primitive>;

export type Screen = {
    bg_color?: string;
    component: string;
    description?: {
        color?: string;
        text_i18n: Record<string, string>;
    };
    featured_image?: string;
    fields: Field[];
    flow: {
        allow_back: boolean;
        allow_skip: boolean;
        label_i18n: Record<string, string>;
        next_screen?: {
            conditions?: Array<{ eq: Record<string, any>; path: string }>;
            default: string;
        };
    };
    id: string;
    title: {
        color?: string;
        text_i18n: Record<string, string>;
    };
};
