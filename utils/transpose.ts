/**
 * Transposes optical power if CYL is positive.
 * Rule: If CYL > 0: new SPH = SPH + CYL, new CYL = -CYL
 */
export const formatPower = (value: number): string => {
    // Always include a sign (+ for zero and positive, - for negative)
    const sign = value >= 0 ? '+' : '-';
    // Work with absolute value to format digits
    const absVal = Math.abs(value);
    // toFixed(2) gives e.g., "1.00"; split integer and decimal parts
    const [intPart, decPart] = absVal.toFixed(2).split('.');
    // Pad integer part to two digits (e.g., "1" -> "01")
    const paddedInt = intPart.padStart(2, '0');
    return `${sign}${paddedInt}.${decPart}`;
};

export const transposePrescription = (sph: number, cyl: number): { sph: number; cyl: number } => {
    if (cyl > 0) {
        return {
            sph: parseFloat((sph + cyl).toFixed(2)),
            cyl: parseFloat((-cyl).toFixed(2)),
        };
    }
    return { sph, cyl };
};

/**
 * Generates an array of values for datalists
 */
export const generateRange = (min: number, max: number, step: number): string[] => {
    const range: string[] = [];
    for (let i = min; i <= max; i += step) {
        range.push(formatPower(i));
    }
    return range;
};
