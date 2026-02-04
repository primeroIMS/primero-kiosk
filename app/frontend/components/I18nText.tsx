import i18n, { I18nLocale } from "@/translations";
import { I18nTranslation } from "@/type";

type Props = {
    fallback?: string;
    text?: I18nTranslation;
};

function I18nText({ fallback, text }: Props) {
    const translatedText = text?.[i18n.locale as I18nLocale];

    if (translatedText) {
        return translatedText;
    }

    if (fallback) {
        return i18n.t(fallback);
    }

    return null;
}

export default I18nText;
