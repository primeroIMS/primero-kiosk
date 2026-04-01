import { Strings } from "@/constants";
import { deepMerge } from "@/lib/deep-merge";
import { AppFlow, AppFlowRecordDefinition, FormValueRecord, FormValues } from "@/type";

import BaseStore from "./base-store";

type FormState = {
    data: FormValues;
};

const DEFAULT_STATE = {
    captchaResponse: "",
    currentRecordDefinition: undefined,
    global: {},
    kiosk: {},
    loading: false,
    records: {},
    retryRecord: {},
    retrySuccessNextScreen: "",
} as FormValues;

class Store extends BaseStore<FormState> {
    getRecordDefinition(recordDefinitionId: string, appFlow: AppFlow) {
        const recordDefinition = appFlow.record_definitions.find(
            (def) => def.id === recordDefinitionId,
        );

        if (!recordDefinition) {
            console.error(`Record definition with id ${recordDefinitionId} not found`);
            return;
        }

        return recordDefinition;
    }

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
            state.data.captchaResponse = "";
            state.data.currentRecordDefinition = undefined;
        });
    }

    set(data: FormValueRecord) {
        this.update((state) => {
            state.data = deepMerge(state.data, data) as FormValues;
        });
    }

    setCaptchaResponse(response: string) {
        this.update((state) => {
            state.data.captchaResponse = response;
        });
    }

    setLoading(loading: boolean) {
        this.update((state) => {
            state.data.loading = loading;
        });
    }

    setRecordDefinitionFields(recordDefinitionId: string, appFlow: AppFlow) {
        const recordDefinition = this.getRecordDefinition(
            recordDefinitionId,
            appFlow,
        ) as AppFlowRecordDefinition;

        this.update((state) => {
            if (!state.data.records) {
                return;
            }

            state.data.currentRecordDefinition = recordDefinition;

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
    storage: { name: Strings.form, provider: Strings.sessionStorage, version: 0 },
});

export default FormStore;
