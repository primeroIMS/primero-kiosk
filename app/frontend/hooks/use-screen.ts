import { useNavigate } from "@tanstack/react-router";
import { get } from "lodash-es";

import evaluateCondition from "@/lib/evaluate-conditions";
import { FormValues, type Screen, ScreenField } from "@/type";
import { ScreenFieldScope } from "@/type";

import useStore from "./use-store";

type UseScreenArgs = {
    config: Screen;
    onNext?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onSubmit?: (data: FormValues) => void;
    shouldComputeNextScreen?: boolean;
};

type UseScreenReturn = {
    name: (id: string, name?: string) => string;
    nextScreenId: (data: FormValues) => string;
    onNext: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onSubmit: (data: FormValues) => void;
    prop: (id: string, prop: keyof ScreenField, defaultValue?: any) => any;
};

// NOTE: Might need to read form store to get all field if you need
// a value from previous screens
function useScreen({
    config,
    onNext,
    onSubmit,
    shouldComputeNextScreen = true,
}: UseScreenArgs): UseScreenReturn {
    const startingScreenId = useStore("systemSettings", "starting_screen_id");
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

    function computeScope(scope: ScreenFieldScope) {
        if (scope === "records") {
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
        onSubmit?.(data);

        if (shouldComputeNextScreen) {
            const nextScreenID = computeNextScreen(data);
            navigate({ params: { id: nextScreenID }, to: "/screens/$id" });
        }
    }

    function onClickNext(event: React.MouseEvent<HTMLButtonElement>) {
        onNext?.(event);

        if (shouldComputeNextScreen) {
            const nextScreenID = computeNextScreen();
            navigate({ params: { id: nextScreenID }, to: "/screens/$id" });
        }
    }

    return {
        name: buildName,
        nextScreenId: (data) => computeNextScreen(data),
        onNext: onClickNext,
        onSubmit: handleSubmit,
        prop: (id: string, prop: keyof ScreenField, defaultValue = "") =>
            get(mappedFields, [id, prop], defaultValue),
    };
}

export default useScreen;
