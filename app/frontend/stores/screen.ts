import { Screen } from "@/type";

import BaseStore from "./base-store";

type ScreenState = {
    data: Screen[];
};

class Store extends BaseStore<ScreenState> {
    getScreenById(id: string): Screen | undefined {
        const state = this.getState();
        return state.data.find((screen) => screen.id === id);
    }

    setScreens(data: Screen[]) {
        this.update((state) => {
            state.data = data;
        });
    }
}

const ScreenStore = new Store({
    defaultState: { data: [] },
    storage: { name: "screens", provider: "idb", version: 0 },
});

export default ScreenStore;
