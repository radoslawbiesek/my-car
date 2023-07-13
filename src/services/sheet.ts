import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export class SheetService {
  private static instance: SheetService;
  private doc: GoogleSpreadsheet | null;

  private constructor() {
    this.doc = null;
  }

  public static async getInstance() {
    if (!SheetService.instance) {
      SheetService.instance = new SheetService();
      SheetService.instance.doc = await SheetService.instance.load();
    }

    return SheetService.instance;
  }

  private async load() {
    const serviceAccountAuth = new JWT({
      email: import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: import.meta.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const doc = new GoogleSpreadsheet(import.meta.env.GOOGLE_DOCUMENT_ID, serviceAccountAuth);
    await doc.loadInfo();

    return doc;
  }

  public async getSheet(sheetName: 'fuel') {
    if (!this.doc) {
      this.doc = await this.load();
    }

    switch (sheetName) {
      case 'fuel':
        return this.doc.sheetsByIndex[0]!;
    }
  }

  public async reset() {
    this.doc = null;
  }
}
