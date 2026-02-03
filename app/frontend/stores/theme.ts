import { PrimitiveRecord } from "@/type";

import BaseStore from "./base-store";

type ThemeState = {
    data: PrimitiveRecord;
};

class Store extends BaseStore<ThemeState> {
    setTheme(data: PrimitiveRecord) {
        this.update((state) => {
            state.data = { ...state.data, ...data };
        });
    }
}

const ThemeStore = new Store({
    defaultState: { data: {} },
    storage: { name: "theme", provider: "idb", version: 0 },
});

export default ThemeStore;
