const VAT = 0.23;

export function calculateCost(cost: number, vatDeduction: number) {
  const multiplier = (1 + VAT * (1 - vatDeduction)) / (1 + VAT);
  return parseFloat((cost * multiplier).toFixed(2));
}
