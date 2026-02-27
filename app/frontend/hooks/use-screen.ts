import { useNavigate } from "@tanstack/react-router";
import { get, set } from "lodash-es";
import { useEffect } from "react";

import { ENDPOINTS, RouteStrings, Strings } from "@/constants";
import api from "@/lib/api-client";
import evaluateCondition from "@/lib/evaluate-conditions";
import riskComparator from "@/lib/risk-comparator";
import FormStore from "@/stores/form";
import { FormValueRecord, ScreenField, UseScreenArgs, UseScreenReturn } from "@/type";
import { ScreenFieldScope } from "@/type";

import useStore from "./use-store";

function useScreen({
    config,
    onNext,
    onSubmit,
    persist = true,
    shouldComputeNextScreen = true,
}: UseScreenArgs): UseScreenReturn {
    const flow = config.appFlow.handle;
    const startingScreenId = config.appFlow.starting_screen_id;
    const navigate = useNavigate();
    const recordIndex = useStore("form", "recordIndex");
    const records = useStore("form", "records");
    const globalData = useStore("form", "global");

    useEffect(() => {
        if (startingScreenId === config.screen.id) {
            FormStore.reset();
        }
    }, [startingScreenId, config.screen.id]);

    useEffect(() => {
        if (config.screen.flow.record_definition_id) {
            FormStore.setRecordDefinitionFields(
                config.screen.flow.record_definition_id,
                config.appFlow,
            );
        }
    }, [config.appFlow, config.screen.flow.record_definition_id]);

    const mappedFields = Object.fromEntries(
        config.screen.fields.map((field) => {
            return [field.slot, field];
        }),
    );

    function computeNextScreen(data?: FormValueRecord) {
        if (config.screen.flow.next_screen?.conditions && data) {
            for (const condition of config.screen.flow.next_screen.conditions) {
                if (evaluateCondition(data, condition, recordIndex)) {
                    return condition.path;
                }
            }
        }

        return config.screen.flow.next_screen?.default as string;
    }

    function computeRiskLevel(data: FormValueRecord): string {
        let currentRiskLevel = FormStore.getState().data.records?.[recordIndex]
            ?.risk_level as string;
        const riskCalculations = config.screen.calculations?.risk;
        if (riskCalculations) {
            for (const riskCalculation of riskCalculations) {
                const { values, ...condition } = riskCalculation;
                const riskLevel = values?.records?.risk_level as string;
                if (
                    evaluateCondition(data, condition, recordIndex) &&
                    riskComparator(riskLevel, currentRiskLevel) > 0
                ) {
                    currentRiskLevel = riskLevel;
                }
            }
        }

        return currentRiskLevel;
    }

    function performFieldCalculations(data: FormValueRecord) {
        const fieldCalculations = config.screen.calculations?.fields;
        if (fieldCalculations) {
            for (const fieldCalculation of fieldCalculations) {
                const { values, ...condition } = fieldCalculation;
                if (evaluateCondition(data, condition, recordIndex)) {
                    for (const [scope, fields] of Object.entries(values)) {
                        for (const [field, value] of Object.entries(fields)) {
                            set(data, `${scope}.${recordIndex}.${field}`, value);
                        }
                    }
                }
            }
        }
    }

    function performCalculations(data: FormValueRecord) {
        const riskLevel = computeRiskLevel(data);
        if (riskLevel) {
            set(data, `records.${recordIndex}.risk_level`, riskLevel);
        }

        performFieldCalculations(data);
    }

    function computeScope(scope: ScreenFieldScope) {
        if (scope === Strings.records) {
            return `records.${recordIndex}`;
        }

        return scope;
    }

    function buildName(id: string, name?: string) {
        const field = mappedFields[id];
        if (!field) {
            throw new Error(`Field with id ${id} not found`);
        }
        return `${computeScope(field.scope)}.${name ?? field.backend_id}`;
    }

    function sharedNextScreenCallbacks(data?: FormValueRecord) {
        if (config.screen.flow.start_new_record) {
            FormStore.incrementRecordIndex();
        }

        if (shouldComputeNextScreen) {
            const nextScreenID = computeNextScreen(data);
            navigate({
                params: { flow, id: nextScreenID },
                to: RouteStrings.screensByID,
            });
        }
    }

    function handleSubmit(data: FormValueRecord) {
        performCalculations(data);

        onSubmit?.(data);
        if (persist) {
            FormStore.set(data);
        }
        sharedNextScreenCallbacks(data);
    }

    function onClickNext(event: React.MouseEvent<HTMLButtonElement>) {
        onNext?.(event);
        sharedNextScreenCallbacks();
    }

    function submitToRemote() {
        if (!config.screen.flow.end_of_flow) return;

        try {
            if (records && records.length > 0) {
                Promise.all(
                    records.map((record) => {
                        const { record_type, ...rest } = record;
                        api.post(ENDPOINTS.records, {
                            data: { ...rest, ...globalData },
                            record_type,
                        });
                    }),
                );
            }
        } catch (error) {
            // TODO: Add error handling in future ticket
        }
    }

    return {
        button: config.screen.button,
        fieldProp: (id: string, prop: keyof ScreenField, defaultValue = Strings.empty) =>
            get(mappedFields, [id, prop], defaultValue),
        flow: config.screen.flow,
        meta: { ...config.appFlow.meta },
        name: buildName,
        nextScreenId: (data) => computeNextScreen(data),
        onNext: onClickNext,
        onSubmit: handleSubmit,
        submitToRemote,
    };
}

export default useScreen;
