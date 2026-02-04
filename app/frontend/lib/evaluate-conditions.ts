import { get } from "lodash-es";

import { FormValues } from "@/type";

type Condition = {
    and?: Condition[];
    eq?: Record<string, any>;
    gt?: Record<string, any>;
    gte?: Record<string, any>;
    in?: Record<string, any[]>;
    lt?: Record<string, any>;
    lte?: Record<string, any>;
    not?: Condition[];
    or?: Condition[];
    path?: string;
};

/**
 * Evaluates a condition object against the provided form data.
 *
 * Supported operators:
 * - `eq`: strict equality
 * - `gt`, `gte`, `lt`, `lte`: numeric comparisons
 * - `in`: membership check for arrays
 * - `and`, `or`, `not`: logical composition of conditions
 *
 * @param data - Form values to evaluate.
 * @param condition - Condition tree to evaluate.
 * @returns `true` if the condition matches; otherwise `false`.
 */
function evaluateCondition(data: FormValues, condition: Condition): boolean {
    if (condition.and) {
        return condition.and.every((c) => evaluateCondition(data, c));
    }

    if (condition.or) {
        return condition.or.some((c) => evaluateCondition(data, c));
    }

    if (condition.not) {
        return !condition.not.some((c) => evaluateCondition(data, c));
    }

    if (condition.eq) {
        return Object.entries(condition.eq).every(
            ([path, value]) => get(data, path) === value,
        );
    }

    if (condition.gt) {
        return Object.entries(condition.gt).every(
            ([path, value]) => get(data, path) > value,
        );
    }

    if (condition.gte) {
        return Object.entries(condition.gte).every(
            ([path, value]) => get(data, path) >= value,
        );
    }

    if (condition.lt) {
        return Object.entries(condition.lt).every(
            ([path, value]) => get(data, path) < value,
        );
    }

    if (condition.lte) {
        return Object.entries(condition.lte).every(
            ([path, value]) => get(data, path) <= value,
        );
    }

    if (condition.in) {
        return Object.entries(condition.in).every(([path, values]) =>
            values.includes(get(data, path)),
        );
    }

    return false;
}

export default evaluateCondition;
