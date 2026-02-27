import { Strings } from "@/constants";
import { deepMerge } from "@/lib/deep-merge";
import { AppFlow, FormValueRecord, FormValues } from "@/type";

import BaseStore from "./base-store";

type FormState = {
    data: FormValues;
};

const DEFAULT_STATE = {
    global: {},
    kiosk: {},
    recordIndex: 0,
    records: [],
} as FormValues;

class Store extends BaseStore<FormState> {
    incrementRecordIndex() {
        this.update((state) => {
            state.data.recordIndex += 1;
        });
    }

    reset() {
        this.update((state) => {
            state.data = DEFAULT_STATE as FormValues;
        });
    }

    rollbackFlow() {
        this.update((state) => {
            if (state.data.records[state.data.recordIndex]) {
                state.data.records.splice(state.data.recordIndex);
            }
        });
    }

    set(data: FormValueRecord) {
        this.update((state) => {
            state.data = deepMerge(state.data, data) as FormValues;
        });
    }

    setRecordDefinitionFields(recordDefinitionId: string, appFlow: AppFlow) {
        const recordDefinition = appFlow.record_definitions.find(
            (def) => def.id === recordDefinitionId,
        );

        if (!recordDefinition) {
            console.error(`Record definition with id ${recordDefinitionId} not found`);
            return;
        }

        this.update((state) => {
            if (!state.data.records) {
                return;
            }

            if (!state.data.records?.[state.data.recordIndex]) {
                state.data.records.push({} as FormValueRecord);
            }

            const record = state.data.records?.[state.data.recordIndex];
            if (state.data.records?.[state.data.recordIndex]) {
                state.data.records[state.data.recordIndex] = deepMerge(record, {
                    module_id: recordDefinition.module_id,
                    record_type: recordDefinition.type,
                }) as FormValueRecord;
            }
        });
    }
}

const FormStore = new Store({
    defaultState: {
        data: DEFAULT_STATE,
    },
    storage: { name: Strings.form, provider: Strings.localStorage, version: 0 },
});

export default FormStore;
