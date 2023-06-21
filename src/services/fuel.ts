import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';

type FuelData = {
  date: string;
  city: string;
  station: string;
  mileage: number;
  amount: number;
  cost: number;
  deduction: number;
};

export class FuelService {
  private constructor(private sheet: GoogleSpreadsheetWorksheet) {}

  static async init() {
    const doc = new GoogleSpreadsheet(import.meta.env.GOOGLE_DOCUMENT_ID);
    await doc.useServiceAccountAuth({
      client_email: import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: import.meta.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0]!;

    return new FuelService(sheet);
  }

  async add(data: FuelData) {
    return await this.sheet.addRow([
      data.date,
      data.city,
      data.station,
      data.mileage,
      data.amount,
      data.cost,
      data.deduction,
    ]);
  }
}
