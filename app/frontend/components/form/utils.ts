import { isArray, isPlainObject } from "lodash-es";

export const hasAnyValue = (value: unknown): boolean => {
    if (isArray(value)) {
        return value.some(hasAnyValue);
    }

    if (isPlainObject(value)) {
        return Object.values(value).some(hasAnyValue);
    }

    return value != null && value !== "";
};
