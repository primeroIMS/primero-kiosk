import { Strings } from "@/constants";
import i18n from "@/translations";
import { LookupOption } from "@/type";

import useStore, { StoreDataMap, StorePropPath } from "./use-store";

type OptionsConfig<T extends keyof StoreDataMap> = {
    i18nKey?: string;
    key: StorePropPath<T>;
    store?: T;
};

function useOptions<T extends keyof StoreDataMap>({
    i18nKey,
    key,
    store,
}: OptionsConfig<T>): LookupOption[] {
    const optionsFromStore = useStore(store ?? (Strings.lookup as T), key);

    if (
        Array.isArray(optionsFromStore) &&
        optionsFromStore.every((item) => typeof item === Strings.string)
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
