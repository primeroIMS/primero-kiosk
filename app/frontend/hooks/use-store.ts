import type { ExtractState, StoreApi, UseBoundStore } from "zustand";

import get from "lodash-es/get";

import FormStore from "@/stores/form";
import ScreenStore from "@/stores/screen";
import SystemSettingsStore from "@/stores/system-settings";
import ThemeStore from "@/stores/theme";

type Store = UseBoundStore<StoreApi<object>>;
type StorePath = keyof typeof Stores;

const Stores = {
    form: FormStore,
    screen: ScreenStore,
    systemSettings: SystemSettingsStore,
    theme: ThemeStore,
} as const;

function useStore(
    storeName: keyof typeof Stores,
    path: string | string[],
    defaultReturn: unknown = "",
) {
    const selector = (state: ExtractState<Store>) => get(state, path, defaultReturn);
    const store = Stores[storeName].store as Store;

    if (!store) {
        throw new Error(`Store "${storeName}" does not exist.`);
    }

    return store(selector);
}

const Actions = Stores;

export default useStore;
export { Actions };
export type { Store, StorePath };
