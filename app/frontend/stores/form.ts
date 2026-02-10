import merge from "deepmerge";

import { Strings } from "@/constants";
import { FormValues } from "@/type";

import BaseStore from "./base-store";

type FormState = {
    data: FormValues;
};

class Store extends BaseStore<FormState> {
    reset() {
        this.update((state) => {
            state.data = {} as FormValues;
        });
    }

    set(data: FormValues) {
        this.update((state) => {
            state.data = merge(state.data, data);
        });
    }
}

const FormStore = new Store({
    defaultState: {
        data: {} as FormValues,
    },
    storage: { name: Strings.form, provider: Strings.localStorage, version: 0 },
});

export default FormStore;
