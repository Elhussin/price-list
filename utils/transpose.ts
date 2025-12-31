/**
 * Transposes optical power if CYL is positive.
 * Rule: If CYL > 0: new SPH = SPH + CYL, new CYL = -CYL
 */
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
 * Formats a number to optical standard (+0.00 or -0.00)
 */
export const formatPower = (value: number): string => {
    const sign = value > 0 ? '+' : value < 0 ? '' : '+';
    return `${sign}${value.toFixed(2)}`;
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
