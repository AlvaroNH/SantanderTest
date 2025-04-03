import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
	providedIn: 'root',
})
export class ExcelService {
	exportToExcel(data: any) {
		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
		const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet }, SheetNames: ['Sheet1'] };

		const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

		const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
		// saveAs(file, 'datos.xlsx');
    return file;
	}
}
