import { PrimitiveRecord } from "@/type";

import BaseStore from "./base-store";

type ThemeState = {
    theme: PrimitiveRecord;
};

class Store extends BaseStore<ThemeState> {
    setTheme(data: PrimitiveRecord) {
        this.update((state) => {
            state.theme = { ...state.theme, ...data };
        });
    }
}

const ThemeStore = new Store({
    defaultState: { theme: {} },
    storage: { name: "theme", provider: "idb", version: 0 },
});

export default ThemeStore;
