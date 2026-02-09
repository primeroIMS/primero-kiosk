import { Strings } from "@/constants";
import { SystemSettings } from "@/type";

import BaseStore from "./base-store";

type SystemSettingsState = {
    data: SystemSettings;
    flow: string;
};

class Store extends BaseStore<SystemSettingsState> {
    setFlow(flow: string) {
        this.update((state) => {
            state.flow = flow;
        });
    }

    setSettings(data: SystemSettings) {
        this.update((state) => {
            state.data = { ...state.data, ...data, flow: "buddy-bot" };
        });
    }
}

// TODO: Temp hard-coded buddybot for flow selection
const SystemSettingsStore = new Store({
    defaultState: { data: {} as SystemSettings, flow: "buddy-bot" },
    storage: { name: Strings.settings, provider: Strings.idb, version: 0 },
});

export default SystemSettingsStore;
