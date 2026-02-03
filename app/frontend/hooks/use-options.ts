import i18n from "@/translations";
import { LookupOption } from "@/type";

import useStore, { StorePath } from "./use-store";

type OptionsConfig = {
    i18nKey?: string;
    key: string;
    store?: StorePath;
};

function useOptions({ i18nKey, key, store = "lookup" }: OptionsConfig): LookupOption[] {
    const optionsFromStore = useStore(store, key);

    if (
        Array.isArray(optionsFromStore) &&
        optionsFromStore.every((item) => typeof item === "string")
    ) {
        return optionsFromStore.map((item) => ({
            label: Object.fromEntries(
                Object.keys(i18n.translations).map((locale) => [
                    locale,
                    i18n.t(`${i18nKey}.${item}`, { locale }),
                ]),
            ) as Record<string, string>,
            value: item,
        })) as LookupOption[];
    }

    return optionsFromStore as LookupOption[];
}

export default useOptions;
export type { OptionsConfig };
