import { Strings } from "@/constants";
import { Lookup, LookupOption } from "@/type";

import BaseStore from "./base-store";

type LookupState = {
    data: Record<string, [] | LookupOption[]>;
};

class Store extends BaseStore<LookupState> {
    setLookups(data: Lookup[]) {
        this.update((state) => {
            state.data = Object.fromEntries(data.map((item) => [item.id, item.options]));
        });
    }
}

const LookupStore = new Store({
    defaultState: { data: {} as Record<string, [] | LookupOption[]> },
    storage: { name: Strings.lookups, provider: Strings.idb, version: 0 },
});

export default LookupStore;
