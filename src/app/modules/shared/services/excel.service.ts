import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
	providedIn: 'root',
})
export class ExcelService {
	/**
	 * Exports the provided data to an Excel file.
	 *
	 * This method converts the input data into an Excel worksheet and creates a workbook
	 * containing the worksheet. The workbook is then written to a binary buffer, which is
	 * returned as a Blob object.
	 *
	 * @param data - The data to be exported to Excel. It should be an array of objects where
	 * each object represents a row in the Excel sheet.
	 * @returns A Blob object representing the Excel file, which can be used for downloading
	 * or further processing.
	 */
	exportToExcel(data: any) {
		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
		const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet }, SheetNames: ['Sheet1'] };

		const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

		const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
		return file;
	}
}
