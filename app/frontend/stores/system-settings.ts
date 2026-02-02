import { PrimitiveRecord } from "@/type";

import BaseStore from "./base-store";

type SystemSettingsState = {
    settings: PrimitiveRecord;
};

class Store extends BaseStore<SystemSettingsState> {
    setSettings(data: PrimitiveRecord) {
        this.update((state) => {
            state.settings = { ...state.settings, ...data };
        });
    }
}

const SystemSettingsStore = new Store({
    defaultState: { settings: {} },
    storage: { name: "settings", provider: "idb", version: 0 },
});

export default SystemSettingsStore;
