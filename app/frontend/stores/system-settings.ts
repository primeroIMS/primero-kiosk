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
});

export default SystemSettingsStore;
