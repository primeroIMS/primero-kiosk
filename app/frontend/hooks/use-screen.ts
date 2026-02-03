import { get } from "lodash-es";

import { type Screen, ScreenField } from "@/type";
import { ScreenFieldScope } from "@/type";

type UseScreenReturn = {
    name: (id: string, name?: string) => string;
    nextScreenId: (data: Record<string, any>) => null | string;
    prop: (id: string, prop: keyof ScreenField, defaultValue?: any) => any;
};

function useScreen(config: Screen): UseScreenReturn {
    const fields = Object.fromEntries(
        config.fields.map((field) => {
            // logic to map config field to form field component
            return [field.field_id, field];
        }),
    );

    function computeNextScreen(data) {}

    function computeScope(scope: ScreenFieldScope) {
        if (scope === "record") {
            return "records.0";
        }

        return scope;
    }

    function buildName(id: string, name?: string) {
        const field = fields[id];
        if (!field) {
            throw new Error(`Field with id ${id} not found`);
        }
        return `${computeScope(field.scope)}.${name ?? field.backend_id}`;
    }

    return {
        name: buildName,
        nextScreenId: (data) => computeNextScreen(data),
        prop: (id: string, prop: keyof ScreenField, defaultValue = "") =>
            get(fields, [id, prop], defaultValue),
    };
}

export default useScreen;
