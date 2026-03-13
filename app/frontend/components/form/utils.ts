import { isArray, isPlainObject } from "lodash-es";

export const hasAnyValue = (value: unknown): boolean => {
    if (isArray(value)) {
        return value.some(hasAnyValue);
    }

    if (isPlainObject(value)) {
        return Object.values(value as Record<string, unknown>).some(hasAnyValue);
    }

    return value != null && value !== "";
};

export function calculateSpan(
    index: number,
    variant: null | string | undefined = "",
    optionsLength: number,
) {
    if (variant !== "outlined" && optionsLength === 3 && index === optionsLength - 1) {
        return true;
    }

    if (optionsLength > 6 && index === optionsLength - 1) return true;

    return false;
}
