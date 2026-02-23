import { useNavigate } from "@tanstack/react-router";
import { get } from "lodash-es";
import { useEffect } from "react";

import { ENDPOINTS, RouteStrings, Strings } from "@/constants";
import api from "@/lib/api-client";
import evaluateCondition from "@/lib/evaluate-conditions";
import FormStore from "@/stores/form";
import { FormValues, ScreenField, UseScreenArgs, UseScreenReturn } from "@/type";
import { ScreenFieldScope } from "@/type";

import useStore from "./use-store";

function useScreen({
    config,
    onNext,
    onSubmit,
    shouldComputeNextScreen = true,
}: UseScreenArgs): UseScreenReturn {
    const flow = config.appFlow.handle;
    const startingScreenId = config.appFlow.starting_screen_id;
    const navigate = useNavigate();
    const recordIndex = useStore("form", "recordIndex");
    const records = useStore("form", "records");

    useEffect(() => {
        if (startingScreenId === config.screen.id) {
            FormStore.reset();
        }
    }, [startingScreenId, config.screen.id]);

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

        return config.screen.flow.next_screen?.default as string;
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

    function sharedNextScreenCallbacks(data?: FormValues) {
        if (config.screen.flow.end_of_flow) {
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

    function handleSubmit(data: FormValues) {
        onSubmit?.(data);
        sharedNextScreenCallbacks(data);
    }

    function onClickNext(event: React.MouseEvent<HTMLButtonElement>) {
        onNext?.(event);
        sharedNextScreenCallbacks();
    }

    function submitToRemote() {
        console.log("Submit form to remote endpoint", records);
        // TODO: Handle errors and show feedback to user, change to actual endpoint when ready
        if (records && records.length > 0) {
            api.post(ENDPOINTS.records, { data: records });
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
        submitToRemote,
    };
}

export default useScreen;
