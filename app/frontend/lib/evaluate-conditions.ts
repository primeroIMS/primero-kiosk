import { get } from "lodash-es";

import { FormValueRecord, Path } from "@/type";

import { parseConditionPath } from "./parse-condition-path";

type Condition<T> = {
    and?: Condition<T>[];
    eq?: Record<string, any>;
    gt?: Record<string, any>;
    gte?: Record<string, any>;
    in?: Record<string, any[]>;
    lt?: Record<string, any>;
    lte?: Record<string, any>;
    not?: Condition<T>[];
    or?: Condition<T>[];
    path?: Path<T>;
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

function evaluateCondition<T extends FormValueRecord = FormValueRecord>(
    data: T,
    condition: Condition<T>,
    recordIndex: number | undefined = undefined,
): boolean {
    if (condition.and) {
        return condition.and.every((c) => evaluateCondition(data, c, recordIndex));
    }

    if (condition.or) {
        return condition.or.some((c) => evaluateCondition(data, c, recordIndex));
    }

    if (condition.not) {
        return !condition.not.some((c) => evaluateCondition(data, c, recordIndex));
    }

    if (condition.eq) {
        return Object.entries(condition.eq).every(
            ([path, value]) => get(data, parseConditionPath(path, recordIndex)) === value,
        );
    }

    if (condition.gt) {
        return Object.entries(condition.gt).every(
            ([path, value]) => get(data, parseConditionPath(path, recordIndex)) > value,
        );
    }

    if (condition.gte) {
        return Object.entries(condition.gte).every(
            ([path, value]) => get(data, parseConditionPath(path, recordIndex)) >= value,
        );
    }

    if (condition.lt) {
        return Object.entries(condition.lt).every(
            ([path, value]) => get(data, parseConditionPath(path, recordIndex)) < value,
        );
    }

    if (condition.lte) {
        return Object.entries(condition.lte).every(
            ([path, value]) => get(data, parseConditionPath(path, recordIndex)) <= value,
        );
    }

    if (condition.in) {
        return Object.entries(condition.in).every(([path, values]) => {
            const dataValue = get(data, parseConditionPath(path, recordIndex));
            if (Array.isArray(dataValue)) {
                return values.some((elem) => dataValue.includes(elem));
            }

            return values.includes(dataValue);
        });
    }

    return false;
}

export default evaluateCondition;
