import { expect, test } from 'vitest';

import { calculateCost, sum, zloty } from './fuel';

test.each([
  [100, 0, 100],
  [100, 0.5, 90.65],
  [100, 1, 81.3],
])('calculateCost(%i, %i) -> %i', (cost, vatDeduction, expected) => {
  expect(calculateCost(cost, vatDeduction)).toBe(expected);
});

test.each([
  [[1, 2, 3], 6],
  [[0, 1, -1], 0],
  [[100, 1, 2], 103],
])('sum(%i) -> %i', (arr, expected) => {
  expect(sum(arr)).toBe(expected);
});

test.each([
  [1, '1.00 zł'],
  [101.3333, '101.33 zł'],
  [10.556, '10.56 zł'],
])('zloty(%i) -> %i', (arr, expected) => {
  expect(zloty(arr)).toBe(expected);
});
