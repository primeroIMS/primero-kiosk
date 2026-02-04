import { Theme } from "@/type";

import BaseStore from "./base-store";

type ThemeState = {
    data: Theme;
};

class Store extends BaseStore<ThemeState> {
    setTheme(data: Theme) {
        this.update((state) => {
            state.data = { ...state.data, ...data };
        });
    }
}

const ThemeStore = new Store({
    defaultState: { data: {} as Theme },
    storage: { name: "theme", provider: "idb", version: 0 },
});

export default ThemeStore;
