import i18n from "@/translations";
import { I18nTranslation } from "@/type";

import I18nText from "./I18nText";

type Props = {
    fallback?: string;
    html?: boolean;
    text?: I18nTranslation | string;
    translate?: boolean;
};

function Text({ fallback, html, text, translate }: Props) {
    return (
        <>
            {translate && typeof text !== "string" ? (
                <I18nText
                    fallback={fallback}
                    html={html}
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
