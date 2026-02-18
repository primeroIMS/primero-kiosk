import { useNavigate } from "@tanstack/react-router";
import { get } from "lodash-es";

import { RouteStrings, Strings } from "@/constants";
import evaluateCondition from "@/lib/evaluate-conditions";
import { FormValues, ScreenField, UseScreenArgs, UseScreenReturn } from "@/type";
import { ScreenFieldScope } from "@/type";

// NOTE: Might need to read form store to get all field if you need
// a value from previous screens
function useScreen({
    config,
    onNext,
    onSubmit,
    shouldComputeNextScreen = true,
}: UseScreenArgs): UseScreenReturn {
    const flow = config.appFlow.handle;
    const startingScreenId = config.appFlow.starting_screen_id;
    const navigate = useNavigate();

    const mappedFields = Object.fromEntries(
        config.screen.fields.map((field) => {
            return [field.slot, field];
        }),
    );

    function computeNextScreen(data?: FormValues) {
        if (config.screen.flow.next_screen?.conditions && data) {
            for (const condition of config.screen.flow.next_screen.conditions) {
                if (evaluateCondition(data, condition)) {
                    return condition.path;
                }
            }
        }

        if (config.screen.flow.end_of_flow) {
            return startingScreenId;
        }

        return config.screen.flow.next_screen?.default as string;
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
        onSubmit?.(data);

        if (shouldComputeNextScreen) {
            const nextScreenID = computeNextScreen(data);
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
        button: config.screen.button,
        fieldProp: (id: string, prop: keyof ScreenField, defaultValue = Strings.empty) =>
            get(mappedFields, [id, prop], defaultValue),
        flow: config.screen.flow,
        name: buildName,
        nextScreenId: (data) => computeNextScreen(data),
        onNext: onClickNext,
        onSubmit: handleSubmit,
    };
}

export default useScreen;
