import { SheetService } from '@services/sheet';
import { calculateCost, calculateCostPer100km, calculateFuelUsage, sumBy } from '@utils/fuel';

type FuelData = {
  date: string;
  city: string;
  station: string;
  mileage: number;
  amount: number;
  cost: number;
  deduction: '0%' | '50%' | '100%';
};

type FuelRowData = {
  [K in keyof FuelData]: FuelData[K] extends string ? FuelData[K] : string;
};

export class FuelService {
  constructor() {}

  public async add(data: FuelData) {
    const sheetService = await SheetService.getInstance();
    const sheet = await sheetService.getSheet('fuel');

    const row = await sheet.addRow([
      data.date,
      data.city,
      data.station,
      data.mileage,
      data.amount,
      data.cost,
      data.deduction,
    ]);

    await sheetService.reset();

    return row;
  }

  private async getRows(fromDate?: string | null, toDate?: string | null) {
    const sheetService = await SheetService.getInstance();
    const sheet = await sheetService.getSheet('fuel');

    const initialRows = await sheet.getRows<FuelRowData>();

    let rows = initialRows.map((row) => {
      const date = row.get('date') as string;
      const city = row.get('city') as string;
      const station = row.get('station') as string;
      const mileage = parseInt(row.get('mileage'));
      const amount = parseFloat(row.get('amount')?.replace(',', '.').replace(' ', ''));
      const cost = parseFloat(row.get('cost')?.replace(',', '.').replace(' ', '')); // '100 000,01' -> 100000.01
      const deduction = parseInt(row.get('deduction')) / 100; // '50%' -> 0.5
      const costReduced = calculateCost(cost, deduction);
      const costDiff = cost - costReduced;

      return {
        date,
        city,
        station,
        mileage,
        amount,
        cost,
        deduction,
        costReduced,
        costDiff,
      };
    });

    if (rows.length >= 2 && (fromDate || toDate)) {
      const fromDateFallback = fromDate || (rows[0]!.date as string);
      const toDateFallback = toDate || (rows.at(-1)!.date as string);
      rows = rows.filter(
        ({ date }) =>
          new Date(date) >= new Date(fromDateFallback) &&
          new Date(date) <= new Date(toDateFallback),
      );
    }

    return rows;
  }

  public async getData(fromDate?: string | null, toDate?: string | null) {
    const rows = await this.getRows(fromDate, toDate);

    const totalFuelUsage = calculateFuelUsage(rows);
    const totalCostPer100km = calculateCostPer100km(rows);
    const totalMileage = rows.at(-1)!.mileage - rows[0]!.mileage;
    const totalAmount = sumBy(rows, (r) => r.amount);
    const totalCost = sumBy(rows, (r) => r.cost);
    const totalUnitCost = totalCost / totalAmount;
    const totalVatDeduction = sumBy(rows, (r) => r.deduction * r.cost) / sumBy(rows, (r) => r.cost);
    const totalCostReduced = sumBy(rows, (r) => r.costReduced);
    const totalCostDiff = sumBy(rows, (r) => r.costDiff);
    const totalUnitCostReduced = totalCostReduced / totalAmount;

    return {
      rows,
      totalFuelUsage,
      totalCostPer100km,
      totalMileage,
      totalUnitCost,
      totalVatDeduction,
      totalCostDiff,
      totalUnitCostReduced,
      totalAmount,
      totalCost,
      totalCostReduced,
    };
  }
}
