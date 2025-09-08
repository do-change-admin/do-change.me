export type Range = { down: number; up: number | undefined }

/**
 * Returns mean value based on up and down borders of 
 * a given range. If up border is not defined, it's 
 * assigned as (down border * 2). For example, if given 
 * range is { down: 100, up: undefined }, up will 
 * be assigned to 200.
 * 
 * @param range Range to find mean value from
 * @returns Mean value
 */
export const meanNumericRangeValue = (range: Range) => {
    const upBorder = range.up || range.down * 2
    const delta = (upBorder - range.down) / 2
    return range.down + delta
}

/**
 * Returns string representation of a given range.
 * 
 * @param range Range needs to be representated as string
 * @returns String representation
 */
export const rangeAsString = (range: Range, postfix?: string) => {
    const postfixString = postfix || undefined;
    if (range.up) {
        return `${range.down ? `${range.down}${postfixString}` : range.down}-${range.up}${postfixString}`
    }

    return `${range.down}${range.down ? postfixString : undefined}+`
}