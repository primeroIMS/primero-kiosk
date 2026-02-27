import { RISK_LEVELS } from "@/constants";

/**
 * Compares two risk levels.
 * Returns a positive number if `risk1` is higher risk than `risk2`,
 * zero if equal, and a negative number if `risk1` is the lower risk.
 */
function riskComparator(risk1: string, risk2: string): number {
    return (RISK_LEVELS[risk1] ?? 0) - (RISK_LEVELS[risk2] ?? 0);
}

export default riskComparator;
