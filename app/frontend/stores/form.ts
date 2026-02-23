import { Strings } from "@/constants";
import { deepMerge } from "@/lib/deep-merge";
import { FormValues } from "@/type";

import BaseStore from "./base-store";

type FormState = {
    data: FormValues;
};

class Store extends BaseStore<FormState> {
    incrementRecordIndex() {
        this.update((state) => {
            state.data.recordIndex += 1;
        });
    }

    reset() {
        this.update((state) => {
            state.data = {} as FormValues;
            state.data.recordIndex = 0;
        });
    }

    set(data: FormValues) {
        this.update((state) => {
            state.data = deepMerge(state.data, data);
        });
    }
}

const FormStore = new Store({
    defaultState: {
        data: { recordIndex: 0 } as FormValues,
    },
    storage: { name: Strings.form, provider: Strings.localStorage, version: 0 },
});

export default FormStore;
