import { SheetService } from '@services/sheet';
import { calculateCost, calculateFuelUsage } from '@utils/fuel';

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

  async add(data: FuelData) {
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

  async getData() {
    const sheetService = await SheetService.getInstance();
    const sheet = await sheetService.getSheet('fuel');

    const initialRows = await sheet.getRows<FuelRowData>();

    const rows = initialRows.map((row) => {
      const date = row.get('date');
      const city = row.get('city');
      const station = row.get('station');
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

    const totalFuelUsage = calculateFuelUsage(rows);
    const lastFuelUsage = calculateFuelUsage(rows.slice(-2));

    return {
      rows,
      totalFuelUsage,
      lastFuelUsage,
    };
  }
}
