import { FormValues } from "@/type";

import evaluateCondition from "./evaluate-conditions";

describe("lib/evaluate-conditions", async () => {
    it("supports eq", () => {
        const data = { status: "open" } as FormValues;
        expect(evaluateCondition(data, { eq: { status: "open" } })).toBe(true);
        expect(evaluateCondition(data, { eq: { status: "closed" } })).toBe(false);
    });

    it("supports gt", () => {
        const data = { score: 10 } as FormValues;
        expect(evaluateCondition(data, { gt: { score: 9 } })).toBe(true);
        expect(evaluateCondition(data, { gt: { score: 10 } })).toBe(false);
    });

    it("supports gte", () => {
        const data = { score: 10 } as FormValues;
        expect(evaluateCondition(data, { gte: { score: 10 } })).toBe(true);
        expect(evaluateCondition(data, { gte: { score: 11 } })).toBe(false);
    });

    it("supports lt", () => {
        const data = { score: 10 } as FormValues;
        expect(evaluateCondition(data, { lt: { score: 11 } })).toBe(true);
        expect(evaluateCondition(data, { lt: { score: 10 } })).toBe(false);
    });

    it("supports lte", () => {
        const data = { score: 10 } as FormValues;
        expect(evaluateCondition(data, { lte: { score: 10 } })).toBe(true);
        expect(evaluateCondition(data, { lte: { score: 9 } })).toBe(false);
    });

    it("supports in", () => {
        const data = { status: "pending" } as FormValues;
        expect(evaluateCondition(data, { in: { status: ["open", "pending"] } })).toBe(
            true,
        );
        expect(evaluateCondition(data, { in: { status: ["open"] } })).toBe(false);
    });

    it("supports and", () => {
        const data = { age: 20, score: 70 } as FormValues;
        const condition = {
            and: [{ gt: { age: 18 } }, { gte: { score: 70 } }],
        };
        expect(evaluateCondition(data, condition)).toBe(true);
    });

    it("supports or", () => {
        const data = { status: "pending" } as FormValues;
        const condition = {
            or: [{ eq: { status: "open" } }, { eq: { status: "pending" } }],
        };
        expect(evaluateCondition(data, condition)).toBe(true);
    });

    it("supports not", () => {
        const data = { archived: false } as FormValues;
        const condition = { not: [{ eq: { archived: true } }] };
        expect(evaluateCondition(data, condition)).toBe(true);
    });

    it("supports nested logical operators", () => {
        const data = { archived: false, status: "open" } as FormValues;
        const condition = {
            and: [{ eq: { status: "open" } }, { not: [{ eq: { archived: true } }] }],
        };
        expect(evaluateCondition(data, condition)).toBe(true);
    });
});
