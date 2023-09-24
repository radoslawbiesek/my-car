import { expect, test } from 'vitest';

import { calculateCost, sumBy, zloty } from './fuel';

test.each([
  [100, 0, 100],
  [100, 0.5, 90.65],
  [100, 1, 81.3],
])('calculateCost(%i, %i) -> %i', (cost, vatDeduction, expected) => {
  expect(calculateCost(cost, vatDeduction)).toBe(expected);
});

test.each([
  [[{ prop: 1 }, { prop: 2 }, { prop: 3 }], 6],
  [[{ prop: 0 }, { prop: -1 }, { prop: 1 }], 0],
  [[{ prop: 100 }, { prop: 1 }, { prop: 2 }], 103],
])('sumBy(%i, el => el.prop) -> %i', (arr, expected) => {
  expect(sumBy(arr, (el) => el.prop)).toBe(expected);
});

test.each([
  [1, '1.00 zł'],
  [101.3333, '101.33 zł'],
  [10.556, '10.56 zł'],
])('zloty(%i) -> %i', (arr, expected) => {
  expect(zloty(arr)).toBe(expected);
});
