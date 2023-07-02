const VAT = 0.23;

export function calculateCost(cost: number, vatDeduction: number) {
  const multiplier = (1 + VAT * (1 - vatDeduction)) / (1 + VAT);
  return parseFloat((cost * multiplier).toFixed(2));
}

export function calculateFuelUsage(rows: { mileage: number; amount: number }[]) {
  if (rows.length < 2) {
    return 0;
  }

  const totalMileage = rows.at(-1)!.mileage - rows[0]!.mileage;
  const totalAmount = rows.slice(1).reduce((total, row) => total + row.amount, 0);

  return parseFloat(((totalAmount / totalMileage) * 100).toFixed(2));
}
