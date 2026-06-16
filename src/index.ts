export interface DiceResult {
    count: number;
    sides: number;
    modifier: number;
}

/**
 * Parses a standard D&D dice expression (e.g., "2d8", "1d20+5", "3d6-2")
 * @param expression The dice notation string to parse
 * @returns An object containing the count, sides, and modifier, or null if invalid.
 */
export function parseDice(expression: string): DiceResult | null {
    // Clean up whitespace just in case a user types "2d6 + 4"
    const cleanExpression = expression.replace(/\s+/g, '');

    const diceRegex = /^(\d+)d(\d+)(?:([+-])(\d+))?$/i;
    const match = cleanExpression.match(diceRegex);

    if (!match) {
        return null; // Invalid expression
    }

    // Extract the captured groups from the match array
    const count = parseInt(match[1], 10);
    const sides = parseInt(match[2], 10);
    const sign = match[3];
    const modifierValue = match[4] ? parseInt(match[4], 10) : 0;

    // Apply the positive or negative sign to the modifier
    const modifier = sign === '-' ? -modifierValue : modifierValue;

    return {
        count,
        sides,
        modifier
    };
}

export function roll(dice: DiceResult): number;
export function roll(expression: string): number;

export function roll(input: string | DiceResult): number {
    let diceObj: DiceResult | null;

    // Check if the input is a string. If so, parse it first
    if (typeof input === 'string') {
        diceObj = parseDice(input);
        if (!diceObj) {
            throw new Error(`Invalid dice expression: "${input}"`);
        }
    } else {
        // If it's not a string, it must be a DiceResult
        diceObj = input;
    }

    // Now perform the actual rolling logic
    let total = 0;
    for (let i = 0; i < diceObj.count; i++) {
        total += Math.floor(Math.random() * diceObj.sides) + 1;
    }

    return total + diceObj.modifier;
}