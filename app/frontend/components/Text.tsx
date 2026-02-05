import i18n from "@/translations";
import { I18nTranslation } from "@/type";

import I18nText from "./I18nText";

type Props = {
    fallback?: string;
    text?: I18nTranslation | string;
    translate?: boolean;
};

function Text({ fallback, text, translate }: Props) {
    return (
        <>
            {translate && typeof text !== "string" ? (
                <I18nText
                    fallback={fallback}
                    text={text}
                />
            ) : translate ? (
                i18n.t(typeof text === "string" ? text : String(text))
            ) : typeof text === "string" ? (
                text
            ) : (
                String(text)
            )}
        </>
    );
}

export default Text;
