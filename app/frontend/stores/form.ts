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
    records: {},
    retryRecord: {},
    retrySuccessNextScreen: "",
} as FormValues;

class Store extends BaseStore<FormState> {
    reset() {
        this.update((state) => {
            state.data = DEFAULT_STATE as FormValues;
        });
    }

    resetRecord() {
        this.update((state) => {
            state.data.records = {} as FormValueRecord;
            state.data.retryRecord = {} as FormValueRecord;
            state.data.retrySuccessNextScreen = "";
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

            state.data.records = deepMerge(state.data.records, {
                module_id: recordDefinition.module_id,
                record_type: recordDefinition.type,
                ...recordDefinition.channel,
            }) as FormValueRecord;
        });
    }

    setRetryRecord(data: Record<string, unknown>, successNextScreen: string) {
        this.update((state) => {
            state.data.retryRecord = data as FormValueRecord;
            state.data.retrySuccessNextScreen = successNextScreen;
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
