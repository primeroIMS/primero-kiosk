import { useNavigate } from "@tanstack/react-router";
import { get } from "lodash-es";

import { RouteStrings, Strings } from "@/constants";
import evaluateCondition from "@/lib/evaluate-conditions";
import riskComparator from "@/lib/risk-comparator";
import FormStore from "@/stores/form";
import { FormValues, ScreenField, UseScreenArgs, UseScreenReturn } from "@/type";
import { ScreenFieldScope } from "@/type";

import useStore from "./use-store";

// NOTE: Might need to read form store to get all field if you need
// a value from previous screens
function useScreen({
    config,
    onNext,
    onSubmit,
    persist = true,
    shouldComputeNextScreen = true,
}: UseScreenArgs): UseScreenReturn {
    const flow = useStore(Strings.systemSettings, Strings.flow);
    const startingScreenId = useStore(Strings.systemSettings, Strings.startingScreenID);
    const navigate = useNavigate();

    const mappedFields = Object.fromEntries(
        config.fields.map((field) => {
            return [field.field_id, field];
        }),
    );

    function computeNextScreen(data?: FormValues) {
        if (config.flow.next_screen?.conditions && data) {
            for (const condition of config.flow.next_screen.conditions) {
                if (evaluateCondition(data, condition)) {
                    return condition.path;
                }
            }
        }

        if (config.flow.end_of_flow) {
            return startingScreenId;
        }

        return config.flow.next_screen?.default as string;
    }

    function computeRisk(data: FormValues): FormValues {
        // TODO: This method will need refactoring once we handle various records.
        const currentRisk = FormStore.getState().data.records?.[0]?.risk as string;
        if (data?.records?.[0]) {
            const record: Record<string, any> = data.records[0];
            config.fields.forEach((field) => {
                const { risk, ...condition } = field?.risk || {};

                if (
                    risk &&
                    riskComparator(risk, currentRisk) > 0 &&
                    evaluateCondition(record, condition)
                ) {
                    record.risk = risk;
                }
            });
        }

        return data;
    }

    function computeScope(scope: ScreenFieldScope) {
        if (scope === Strings.records) {
            return "records.0";
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

    function handleSubmit(data: FormValues) {
        const submitData = computeRisk(data);

        onSubmit?.(submitData);

        if (persist) {
            FormStore.set(submitData);
        }

        if (shouldComputeNextScreen) {
            const nextScreenID = computeNextScreen(submitData);
            navigate({
                params: { flow, id: nextScreenID },
                to: RouteStrings.screensByID,
            });
        }
    }

    function onClickNext(event: React.MouseEvent<HTMLButtonElement>) {
        onNext?.(event);

        if (shouldComputeNextScreen) {
            const nextScreenID = computeNextScreen();
            navigate({
                params: { flow, id: nextScreenID },
                to: RouteStrings.screensByID,
            });
        }
    }

    return {
        button: config.button,
        fieldProp: (id: string, prop: keyof ScreenField, defaultValue = Strings.empty) =>
            get(mappedFields, [id, prop], defaultValue),
        flow: config.flow,
        name: buildName,
        nextScreenId: (data) => computeNextScreen(data),
        onNext: onClickNext,
        onSubmit: handleSubmit,
    };
}

export default useScreen;
