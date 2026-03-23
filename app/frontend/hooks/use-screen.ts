import { useNavigate } from "@tanstack/react-router";
import { get, isEmpty, set } from "lodash-es";
import { useCallback, useEffect } from "react";

import { ENDPOINTS, RouteStrings, Strings } from "@/constants";
import api from "@/lib/api-client";
import evaluateCondition from "@/lib/evaluate-conditions";
import riskComparator from "@/lib/risk-comparator";
import FormStore from "@/stores/form";
import {
    FormValueRecord,
    ScreenCalculation,
    ScreenField,
    UseScreenArgs,
    UseScreenReturn,
} from "@/type";

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
    const records = useStore(Strings.form, Strings.records);
    const captchaResponse = useStore(Strings.form, Strings.captchaResponse);
    const globalData = useStore(Strings.form, Strings.global);
    const captchaConfig = useStore(Strings.systemSettings, Strings.captcha);

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

    const computeNextScreen = useCallback(
        (data?: FormValueRecord) => {
            if (config.screen.flow.next_screen?.conditions && data) {
                for (const condition of config.screen.flow.next_screen.conditions) {
                    if (evaluateCondition(data, condition)) {
                        return condition.path;
                    }
                }
            }

            return config.screen.flow.next_screen?.default as string;
        },
        [config.screen.flow.next_screen],
    );

    const submitToRemote = useCallback(async () => {
        if (!config.screen.flow.end_of_flow) return;

        try {
            if (!isEmpty(records)) {
                const { record_type, ...rest } = records;
                const dataToSend = {
                    ...(captchaResponse && { captcha_token: captchaResponse }),
                    data: { ...rest, ...globalData },
                    record_type,
                };
                FormStore.setRetryRecord(
                    dataToSend,
                    computeNextScreen(records as FormValueRecord),
                );
                const response = await api.post(ENDPOINTS.records, dataToSend);

                if (response.status === 204) {
                    FormStore.resetRecord();
                }
            }
        } catch (error) {
            navigate({
                params: { flow: config.appFlow.handle },
                to: "/$flow/error",
            });
        }
    }, [
        computeNextScreen,
        config.appFlow.handle,
        config.screen.flow.end_of_flow,
        globalData,
        navigate,
        records,
        captchaResponse,
    ]);

    useEffect(() => {
        if (!config.screen.flow.end_of_flow) return;

        if (captchaConfig === undefined) return;

        if (!captchaResponse && !isEmpty(captchaConfig)) {
            console.warn(
                "Captcha response is required but not available, cannot submit to remote",
            );
            return;
        }

        submitToRemote();
    }, [
        computeNextScreen,
        config.appFlow.handle,
        config.screen.flow.end_of_flow,
        globalData,
        navigate,
        records,
        submitToRemote,
        captchaResponse,
        captchaConfig,
    ]);

    const mappedFields = Object.fromEntries(
        config.screen.fields.map((field) => {
            return [field.slot, field];
        }),
    );

    function performRiskCalculations(
        data: FormValueRecord,
        calculations: ScreenCalculation[],
    ) {
        let currentRiskLevel = FormStore.getState().data.records?.risk_level as string;

        for (const calculation of calculations) {
            const { values, ...condition } = calculation;
            const riskLevel = values?.records?.risk_level as string;
            if (
                evaluateCondition(data, condition) &&
                riskComparator(riskLevel, currentRiskLevel) > 0
            ) {
                currentRiskLevel = riskLevel;
            }
        }

        if (currentRiskLevel) {
            set(data, Strings.recordRiskLevel, currentRiskLevel);
        }
    }

    function performFieldCalculations(
        data: FormValueRecord,
        calculations: ScreenCalculation[],
    ) {
        for (const calculation of calculations) {
            const { values, ...condition } = calculation;
            if (evaluateCondition(data, condition)) {
                for (const [scope, targets] of Object.entries(values)) {
                    for (const [field, value] of Object.entries(targets)) {
                        set(data, `${scope}.${field}`, value);
                    }
                }
            }
        }
    }

    // TODO: data is actually { [scope]: [{...}] }
    function performCalculations(data: FormValueRecord) {
        if (config.screen.calculations?.risk) {
            performRiskCalculations(data, config.screen.calculations.risk);
        }

        if (config.screen.calculations?.fields) {
            performFieldCalculations(data, config.screen.calculations.fields);
        }
    }

    function buildName(id: string, name?: string) {
        const field = mappedFields[id];
        if (!field) {
            throw new Error(`Field with id ${id} not found`);
        }
        return `${field.scope}.${name ?? field.backend_id}`;
    }

    function sharedNextScreenCallbacks(data?: FormValueRecord) {
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

    return {
        button: config.screen.button,
        fieldProp: (
            id: string,
            prop: keyof ScreenField,
            defaultValue = Strings.empty,
        ) => {
            return get(mappedFields, [id, prop], defaultValue);
        },
        flow: config.screen.flow,
        meta: { ...config.appFlow.meta },
        name: buildName,
        nextScreenId: (data) => computeNextScreen(data),
        onNext: onClickNext,
        onSubmit: handleSubmit,
    };
}

export default useScreen;
