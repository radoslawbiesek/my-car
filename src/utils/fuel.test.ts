import { expect, test } from 'vitest';

import { calculateCost } from './fuel';

test.each([
  [100, 0, 100],
  [100, 0.5, 90.65],
  [100, 1, 81.3],
])('calculateCost(%i, %i) -> %i', (cost, vatDeduction, expected) => {
  expect(calculateCost(cost, vatDeduction)).toBe(expected);
});
