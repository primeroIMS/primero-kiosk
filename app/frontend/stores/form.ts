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
            state.data = { ...state.data, ...data };
        });
    }
}

const FormStore = new Store({
    defaultState: {
        data: {} as FormValues,
    },
    storage: { name: "form-storage", provider: "localStorage", version: 0 },
});

export default FormStore;
