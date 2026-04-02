import { useNavigate } from "@tanstack/react-router";
import { get, isEmpty, set } from "lodash-es";
import { useCallback, useEffect, useRef, useTransition } from "react";

import { ENDPOINTS, RouteStrings, Strings } from "@/constants";
import api from "@/lib/api-client";
import evaluateCondition from "@/lib/evaluate-conditions";
import riskComparator from "@/lib/risk-comparator";
import FormStore from "@/stores/form";
import {
    FormValueRecord,
    ScreenCalculation,
    ScreenField,
    SystemCaptcha,
    UseScreenArgs,
    UseScreenReturn,
} from "@/type";

import useStore from "./use-store";

type ConfigurationType = {
    [key: string]: {
        cleanup: (widgetId: string) => void;
        render: (args: {
            captchaConfig: SystemCaptcha;
            errorCallback?: () => void;
            successCallback?: (token: string) => void;
        }) => string | undefined;
    };
};

const configuration: ConfigurationType = {
    turnstile: {
        cleanup: (widgetId) => {
            if (window.turnstile && widgetId) window.turnstile.remove(widgetId);
        },
        render: ({ captchaConfig, errorCallback, successCallback }) => {
            if (!document.getElementById("captcha") || !window.turnstile) return;
            return window.turnstile.render(
                document.getElementById("captcha") as HTMLElement,
                {
                    callback: (token) => {
                        successCallback?.(token);
                        window.turnstile.remove(
                            document.getElementById("captcha") as HTMLElement,
                        );
                    },
                    "error-callback": () => errorCallback?.(),
                    "expired-callback": () => errorCallback?.(),
                    retry: "auto",
                    "retry-interval": 2000,
                    sitekey: captchaConfig.site_key,
                    "timeout-callback": () => errorCallback?.(),
                },
            );
        },
    },
} as const;

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
    const globalData = useStore(Strings.form, Strings.global);
    const captchaConfig = useStore(Strings.systemSettings, Strings.captcha);
    const hasRun = useRef(false);

    const currentRecordDefinition = useStore(
        Strings.form,
        Strings.currentRecordDefinition,
    );

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

    const parseDataBeforeSubmit = useCallback(
        (token?: string) => {
            const recordTypeFromStore = currentRecordDefinition?.type;

            const { record_type, ...rest } = records;
            const dataToSend = {
                ...(token && { captcha_token: token }),
                data: { ...rest, ...globalData },
                record_type: record_type || recordTypeFromStore,
            };
            FormStore.setRetryRecord(
                dataToSend,
                computeNextScreen(records as FormValueRecord),
            );

            return dataToSend;
        },
        [records, globalData, computeNextScreen, currentRecordDefinition],
    );

    const submitToRemote = useCallback(
        async (token?: string) => {
            FormStore.setLoading(true);

            if (!isEmpty(records)) {
                const dataToSend = parseDataBeforeSubmit(token);
                try {
                    const response = await api.post(ENDPOINTS.records, dataToSend);
                    if (response.status === 204) {
                        FormStore.resetRecord();
                    }
                    FormStore.setCaptchaResponse("");
                    FormStore.setLoading(false);
                } catch (error) {
                    console.error("Error submitting data:", error);
                    FormStore.setCaptchaResponse("");
                    FormStore.setLoading(false);
                    navigate({
                        params: { flow: config.appFlow.handle },
                        to: "/$flow/error",
                    });
                }
            } else {
                console.warn("No data to submit");
                FormStore.setLoading(false);
            }
        },
        [records, parseDataBeforeSubmit, navigate, config.appFlow.handle],
    );

    useEffect(() => {
        if (hasRun.current || !config.screen.flow.end_of_flow) return;
        hasRun.current = true;

        if (!currentRecordDefinition?.type) {
            return;
        }

        const submitRecord = async () => {
            const isCaptchaConfigured =
                Boolean(captchaConfig?.provider) && Boolean(captchaConfig?.site_key);

            if (isCaptchaConfigured) {
                configuration?.[captchaConfig.provider]?.render({
                    captchaConfig,
                    errorCallback: () => {
                        parseDataBeforeSubmit();
                        navigate({
                            params: { flow: config.appFlow.handle },
                            to: "/$flow/error",
                        });
                        return true;
                    },
                    successCallback: (token: string) => {
                        submitToRemote(token);
                    },
                });
            } else {
                submitToRemote();
            }
        };

        submitRecord();
    }, [
        captchaConfig,
        config.appFlow.handle,
        config.screen.flow.end_of_flow,
        navigate,
        currentRecordDefinition,
        parseDataBeforeSubmit,
        submitToRemote,
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
