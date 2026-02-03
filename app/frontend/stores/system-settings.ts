import { SystemSettings } from "@/type";

import BaseStore from "./base-store";

type SystemSettingsState = {
    data: SystemSettings;
};

class Store extends BaseStore<SystemSettingsState> {
    setSettings(data: SystemSettings) {
        this.update((state) => {
            state.data = { ...state.data, ...data };
        });
    }
}

const SystemSettingsStore = new Store({
    defaultState: { data: {} as SystemSettings },
    storage: { name: "settings", provider: "idb", version: 0 },
});

export default SystemSettingsStore;
