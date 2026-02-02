import { Screen } from "@/type";

import BaseStore from "./base-store";

type ScreenState = {
    screens: Screen[];
};

class Store extends BaseStore<ScreenState> {
    getScreenById(id: string): Screen | undefined {
        const state = this.getState();
        return state.screens.find((screen) => screen.id === id);
    }

    setScreens(data: Screen[]) {
        this.update((state) => {
            state.screens = data;
        });
    }
}

const ScreenStore = new Store({
    defaultState: { screens: [] },
    storage: { name: "screens", provider: "idb", version: 0 },
});

export default ScreenStore;
