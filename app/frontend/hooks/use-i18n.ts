import { I18n } from "i18n-js";

import translations from "../translations.json";

const i18n = new I18n(translations);

function useI18n() {
    return i18n;
}

export default useI18n;
