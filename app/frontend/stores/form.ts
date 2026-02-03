import { PrimitiveRecord } from "@/type";

import BaseStore from "./base-store";

type FormState = {
    formData: PrimitiveRecord;
};

class Store extends BaseStore<FormState> {
    reset() {
        this.update((state) => {
            state.formData = {} as PrimitiveRecord;
        });
    }

    set(data: PrimitiveRecord) {
        this.update((state) => {
            state.formData = { ...state.formData, ...data };
        });
    }
}

const FormStore = new Store({
    defaultState: {
        formData: {} as PrimitiveRecord,
    },
    storage: { name: "form-storage", provider: "localStorage", version: 0 },
});

export default FormStore;
