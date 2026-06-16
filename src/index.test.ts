import { describe, it, expect } from 'vitest';
import { parseDice, roll } from './index.js';

describe('parseDice()', () => {
    it('should parse a basic dice expression', () => {
        expect(parseDice('2d8')).toEqual({ count: 2, sides: 8, modifier: 0 });
    });

    it('should parse expressions with a positive modifier', () => {
        expect(parseDice('1d20+5')).toEqual({ count: 1, sides: 20, modifier: 5 });
    });

    it('should parse expressions with a negative modifier', () => {
        expect(parseDice('3d6-2')).toEqual({ count: 3, sides: 6, modifier: -2 });
    });

    it('should handle whitespace gracefully', () => {
        expect(parseDice('4 d 10 + 3')).toEqual({ count: 4, sides: 10, modifier: 3 });
    });

    it('should return null for invalid expressions', () => {
        expect(parseDice('invalid')).toBeNull();
        expect(parseDice('2d')).toBeNull();
    });
});

describe('roll()', () => {
    it('should accept a DiceResult object and return a number within the expected range', () => {
        const dice = { count: 2, sides: 6, modifier: 2 }; // 2d6+2 (Min: 4, Max: 14)
        const result = roll(dice);

        expect(result).toBeGreaterThanOrEqual(4);
        expect(result).toBeLessThanOrEqual(14);
    });

    it('should accept a string expression directly', () => {
        const result = roll('1d20+10'); // Min: 11, Max: 30

        expect(result).toBeGreaterThanOrEqual(11);
        expect(result).toBeLessThanOrEqual(30);
    });

    it('should throw an error for invalid string expressions', () => {
        expect(() => roll('broken-string')).toThrowError('Invalid dice expression');
    });
});