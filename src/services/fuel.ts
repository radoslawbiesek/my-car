import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

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
  private static instance: FuelService;
  private sheet!: GoogleSpreadsheetWorksheet;
  private rows!: Awaited<ReturnType<typeof this.fetchRows>> | null;

  private constructor() {}

  private async load() {
    const serviceAccountAuth = new JWT({
      email: import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: import.meta.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const doc = new GoogleSpreadsheet(import.meta.env.GOOGLE_DOCUMENT_ID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]!;

    this.sheet = sheet;
  }

  public static getInstance(): FuelService {
    if (!FuelService.instance) {
      FuelService.instance = new FuelService();
    }

    return FuelService.instance;
  }

  async add(data: FuelData) {
    if (!this.sheet) {
      await this.load();
    }

    const row = await this.sheet.addRow([
      data.date,
      data.city,
      data.station,
      data.mileage,
      data.amount,
      data.cost,
      data.deduction,
    ]);

    this.rows = null;

    return row;
  }

  private async fetchRows() {
    const rows = await this.sheet.getRows<FuelRowData>();

    const formattedRows = rows.map((row) => ({
      date: row.get('date'),
      city: row.get('city'),
      station: row.get('station'),
      mileage: parseInt(row.get('mileage')),
      amount: parseFloat(row.get('amount')?.replace(',', '.').replace(' ', '')),
      cost: parseFloat(row.get('cost')?.replace(',', '.').replace(' ', '')), // '100 000,01' -> 100000.01
      deduction: parseInt(row.get('deduction')) / 100, // '50%' -> 0.5
    }));

    return formattedRows;
  }

  async getAll() {
    if (!this.sheet) {
      await this.load();
    }

    if (!this.rows) {
      this.rows = await this.fetchRows();
    }

    return this.rows;
  }

  async getData() {
    const initialRows = await this.getAll();

    const rows = initialRows.map((r) => {
      const costReduced = calculateCost(r.cost, r.deduction);
      const costDiff = r.cost - costReduced;

      return { ...r, costReduced, costDiff };
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
