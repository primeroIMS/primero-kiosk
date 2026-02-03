import i18n, { I18nLocale } from "@/translations";
import { I18nTranslation } from "@/type";

type Props = {
    fallback?: string;
    text?: I18nTranslation;
};

function I18nText({ fallback, text }: Props) {
    return (
        text?.[i18n.locale as I18nLocale] ||
        i18n.t(fallback || "common.missing_translation")
    );
}

export default I18nText;
