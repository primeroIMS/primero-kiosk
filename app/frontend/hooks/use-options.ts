import i18n from "@/translations";

import useStore, { StorePath } from "./use-store";

type Option = {
    label: string;
    value: string;
};

type OptionsConfig = {
    i18nKey?: string;
    key: string;
    store?: StorePath;
};

function useOptions({ i18nKey, key, store = "theme" }: OptionsConfig): Option[] {
    const optionsFromStore = useStore(store, key);

    if (
        Array.isArray(optionsFromStore) &&
        optionsFromStore.every((item) => typeof item === "string")
    ) {
        return optionsFromStore.map((item) => ({
            label: i18n.t(`${i18nKey}.${item}`),
            value: item,
        }));
    }

    return optionsFromStore;
}

export default useOptions;
export type { Option, OptionsConfig };
