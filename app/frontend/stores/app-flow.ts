import { Strings } from "@/constants";
import { AppFlow, Screen } from "@/type";

import BaseStore from "./base-store";

type AppFlowState = {
    data: AppFlow[];
};

class Store extends BaseStore<AppFlowState> {
    getAppFlowByHandle(handle: string): AppFlow | undefined {
        return this.getState().data.find((f) => f.handle === handle);
    }

    getFirstAppFlow(): AppFlow | undefined {
        return this.getState().data[0];
    }

    getScreenById(
        flowHandle: string,
        screenId: string,
    ): [Screen | undefined, AppFlow | undefined] {
        const flow = this.getAppFlowByHandle(flowHandle);
        return [flow?.screens.find((s) => s.id === screenId), flow];
    }

    setData(flows: AppFlow[]) {
        this.update((state) => {
            state.data = flows;
        });
    }
}

const AppFlowsStore = new Store({
    defaultState: { data: [] as AppFlow[] },
    storage: { name: Strings.appFlow, provider: Strings.idb, version: 0 },
});

export default AppFlowsStore;
