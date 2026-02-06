import type { StoreApi, UseBoundStore } from "zustand";

import get from "lodash-es/get";

import FormStore from "@/stores/form";
import LookupStore from "@/stores/lookup-store";
import ScreenStore from "@/stores/screen";
import SystemSettingsStore from "@/stores/system-settings";
import ThemeStore from "@/stores/theme";
import { Path, PathValue } from "@/type";

type Store = UseBoundStore<StoreApi<object>>;
type StorePath = keyof typeof Stores;

const Stores = {
    form: FormStore,
    lookup: LookupStore,
    screen: ScreenStore,
    systemSettings: SystemSettingsStore,
    theme: ThemeStore,
} as const;

type ExtractStoreData<T> = T extends { store: UseBoundStore<StoreApi<infer S>> }
    ? S extends { data: infer D }
        ? D
        : never
    : never;

type StoreDataMap = {
    form: ExtractStoreData<typeof FormStore>;
    lookup: ExtractStoreData<typeof LookupStore>;
    screen: ExtractStoreData<typeof ScreenStore>;
    systemSettings: ExtractStoreData<typeof SystemSettingsStore>;
    theme: ExtractStoreData<typeof ThemeStore>;
};

type StorePropPath<S extends keyof StoreDataMap> = Path<StoreDataMap[S]>;

function useStore<S extends keyof StoreDataMap, P extends StorePropPath<S>>(
    storeName: S,
    path: P,
    defaultReturn?: PathValue<StoreDataMap[S], P>,
): PathValue<StoreDataMap[S], P> {
    const selector = (state: { data: StoreDataMap[S] }) =>
        get(state, `data.${path}`, defaultReturn);
    const store = Stores[storeName].store as unknown as UseBoundStore<
        StoreApi<{ data: StoreDataMap[S] }>
    >;

    if (!store) {
        throw new Error(`Store "${storeName}" does not exist.`);
    }

    return store(selector) as PathValue<StoreDataMap[S], P>;
}

const Actions = Stores;

export default useStore;
export { Actions };
export type { Store, StoreDataMap, StorePath, StorePropPath };
