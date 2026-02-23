export type DeepMerge<T, U> = T extends Builtin
    ? U
    : U extends Builtin
      ? U
      : T extends Array<infer TItem>
        ? U extends Array<infer UItem>
            ? Array<DeepMerge<TItem, UItem>>
            : U
        : T extends object
          ? U extends object
              ? {
                    [K in keyof T | keyof U]: K extends keyof U
                        ? K extends keyof T
                            ? DeepMerge<T[K], U[K]>
                            : U[K]
                        : K extends keyof T
                          ? T[K]
                          : never;
                }
              : U
          : U;

type Builtin = Date | Function | Primitive | RegExp;

type Primitive = bigint | boolean | null | number | string | symbol | undefined;

export function deepMerge<T, U>(target: T, source: U): DeepMerge<T, U> {
    if (isArray(target) && isArray(source)) {
        const maxLength = Math.max(target.length, source.length);
        const result: unknown[] = [];

        for (let i = 0; i < maxLength; i++) {
            const tVal = target[i];
            const sVal = source[i];

            if (sVal === undefined) {
                result[i] = tVal;
            } else if (tVal === undefined) {
                result[i] = sVal;
            } else {
                result[i] = deepMerge(tVal, sVal);
            }
        }

        return result as DeepMerge<T, U>;
    }

    if (isObject(target) && isObject(source)) {
        const result: Record<string, unknown> = { ...target };

        for (const key of Object.keys(source)) {
            const tVal = result[key];
            const sVal = source[key];

            if (key in result) {
                result[key] = deepMerge(tVal, sVal);
            } else {
                result[key] = sVal;
            }
        }

        return result as DeepMerge<T, U>;
    }

    return source as DeepMerge<T, U>;
}

function isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
