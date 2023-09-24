const VAT = 0.23;

export function calculateCost(cost: number, vatDeduction: number): number {
  const multiplier = (1 + VAT * (1 - vatDeduction)) / (1 + VAT);
  return parseFloat((cost * multiplier).toFixed(2));
}

export function calculateFuelUsage(rows: { mileage: number; amount: number }[]): number {
  if (rows.length < 2) {
    return 0;
  }

  const totalMileage = rows.at(-1)!.mileage - rows[0]!.mileage;
  const totalAmount = sumBy(rows.slice(1), (el) => el.amount);

  return parseFloat(((totalAmount / totalMileage) * 100).toFixed(2));
}

export function calculateCostPer100km(rows: { mileage: number; cost: number }[]): number {
  if (rows.length < 2) {
    return 0;
  }

  const totalMileage = rows.at(-1)!.mileage - rows[0]!.mileage;
  const totalCost = sumBy(rows.slice(1), (el) => el.cost);

  return (totalCost / totalMileage) * 100;
}

export function sumBy<T extends any>(arr: T[], iteratee: (el: T) => number) {
  return arr.reduce((total, el) => total + iteratee(el), 0);
}

export function zloty(amount: number) {
  return `${amount.toFixed(2)} zł`;
}

export function getFuelSearchParams(urlStr: string) {
  const url = new URL(urlStr);
  const search = new URLSearchParams(url.search);

  const from = search.get('from');
  const to = search.get('to');

  return { from, to };
}
