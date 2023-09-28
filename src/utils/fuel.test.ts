import { expect, test } from 'vitest';

import { calculateCost, sumBy, zloty, calculateCostPer100km, calculateFuelUsage } from './fuel';

test.each([
  [100, 0, 100],
  [100, 0.5, 90.65],
  [100, 1, 81.3],
])('calculateCost(%i, %i) -> %i', (cost, vatDeduction, expected) => {
  expect(calculateCost(cost, vatDeduction)).toBe(expected);
});

test.each([
  [
    [
      { mileage: 30000, amount: 30 },
      { mileage: 30100, amount: 10 },
    ],
    10,
  ],
  [
    [
      { mileage: 30000, amount: 30 },
      { mileage: 30100, amount: 10 },
      { mileage: 30150, amount: 5 },
    ],
    10,
  ],
  [[{ mileage: 30000, amount: 30 }], 0],
])('calculateFuelUsage(%j) -> %i', (rows, expected) => {
  expect(calculateFuelUsage(rows)).toEqual(expected);
});

test.each([
  [
    [
      { mileage: 30000, costReduced: 50 },
      { mileage: 30100, costReduced: 50 },
    ],
    50,
  ],
  [
    [
      { mileage: 30000, costReduced: 50 },
      { mileage: 30100, costReduced: 50 },
      { mileage: 30150, costReduced: 25 },
    ],
    50,
  ],
])('calculateCostPer100km(%j) -> %i', (rows, expected) => {
  expect(calculateCostPer100km(rows)).toEqual(expected);
});

test.each([
  [[{ prop: 1 }, { prop: 2 }, { prop: 3 }], 6],
  [[{ prop: 0 }, { prop: -1 }, { prop: 1 }], 0],
  [[{ prop: 100 }, { prop: 1 }, { prop: 2 }], 103],
])('sumBy(%j, el => el.prop) -> %i', (arr, expected) => {
  expect(sumBy(arr, (el) => el.prop)).toBe(expected);
});

test.each([
  [1, '1.00 zł'],
  [101.3333, '101.33 zł'],
  [10.556, '10.56 zł'],
])('zloty(%i) -> %i', (arr, expected) => {
  expect(zloty(arr)).toBe(expected);
});
