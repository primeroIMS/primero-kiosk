import { isEmpty } from "lodash-es";
import { useEffect, useState } from "react";

import i18n, { I18nLocale } from "@/translations";
import { I18nTranslation } from "@/type";

type Props = {
    cycleText?: boolean;
    fallback?: string;
    text?: I18nTranslation;
};

function I18nText({ cycleText, fallback, text }: Props) {
    const [keyIndex, setKeyIndex] = useState<number>(0);
    const keys = Object.keys(text || {});

    useEffect(() => {
        if (cycleText && !isEmpty(text)) {
            const interval = setInterval(() => {
                if (keys.length > 0) {
                    setKeyIndex((prevIndex) =>
                        prevIndex + 1 < keys.length ? prevIndex + 1 : 0,
                    );
                }
            }, 3000);

            return () => {
                if (interval) {
                    clearInterval(interval);
                }
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (cycleText && !isEmpty(text)) {
        return text[keys[keyIndex] as I18nLocale];
    }

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
