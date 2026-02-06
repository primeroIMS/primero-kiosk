import { produce } from "immer";
import { create, type StoreApi, type UseBoundStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Strings } from "@/constants";

import idbStorage from "./idb-storage";

type BaseStoreParams<T> = {
    defaultState?: Partial<T>;
    storage?: { name: string; provider: StorageProvider; version: number };
};
type StorageProvider = "idb" | "localStorage";

class BaseStore<T> {
    public defaultState: Partial<T>;
    public persistConfig?: object;
    public store: UseBoundStore<StoreApi<T>>;

    constructor({ defaultState, storage }: BaseStoreParams<T>) {
        this.defaultState = defaultState ?? {};

        const storeArgs = storage
            ? persist(() => this.defaultState as T, {
                  name: storage.name,
                  storage: this.storageProvider(storage.provider),
                  version: storage.version,
              })
            : () => this.defaultState as T;
        this.store = create<T>()(storeArgs);
        this.persistConfig = persist;
    }

    public getState(): T {
        return this.store.getState();
    }

    public setState(fn: (state: T) => Partial<T>) {
        this.store.setState(fn);
    }

    public storageProvider(provider: StorageProvider) {
        switch (provider) {
            case Strings.idb:
                return idbStorage;

            default:
                return createJSONStorage(() => localStorage);
        }
    }

    public update(fn: (state: T) => void) {
        this.setState(produce((state: T) => fn(state)) as (state: T) => Partial<T>);
    }
}

export default BaseStore;
