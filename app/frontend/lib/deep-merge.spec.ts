import { deepMerge } from "./deep-merge";

describe("lib/deep-merge", async () => {
    it("merges two objects", () => {
        const obj1 = { a: 1, b: { c: 2 } };
        const obj2 = { b: { d: 3 }, e: 4 };
        const result = deepMerge(obj1, obj2);
        expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
    });

    it("merges arrays by index", () => {
        const obj1 = { a: [1, 2], b: { c: [3, 4] } };
        const obj2 = { a: [undefined, 3], b: { c: [undefined, 5] } };
        const result = deepMerge(obj1, obj2);
        expect(result).toEqual({ a: [1, 3], b: { c: [3, 5] } });
    });

    it("overwrites non-object values", () => {
        const obj1 = { a: 1, b: { c: 2 } };
        const obj2 = { a: 3, b: 4 };
        const result = deepMerge(obj1, obj2);
        expect(result).toEqual({ a: 3, b: 4 });
    });
});
