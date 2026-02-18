import riskComparator from "./risk-comparator";

describe("lib/evaluate-conditions", async () => {
    it("should return a positive number if risk1 is higher risk than risk2", () => {
        expect(riskComparator("high", "low")).toBeGreaterThan(0);
    });

    it("should return zero if risk1 is equal to risk2", () => {
        expect(riskComparator("high", "high")).toBe(0);
    });

    it("should return a negative number if risk1 is lower risk than risk2", () => {
        expect(riskComparator("low", "high")).toBeLessThan(0);
    });
});
