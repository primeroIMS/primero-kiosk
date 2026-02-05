import { Strings } from "@/constants";
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
    storage: { name: Strings.theme, provider: Strings.idb, version: 0 },
});

export default ThemeStore;
