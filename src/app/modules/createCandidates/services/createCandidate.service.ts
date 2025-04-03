import { inject, Injectable } from '@angular/core';
import {
	CandidateFormInterface,
	type ExcelCandidateDataInterface,
} from '../../shared/interfaces/candidateForm.interface';
import { Seniority } from '../../shared/interfaces/seniority.enum';
import { ExcelService } from '../../shared/services/excel.service';
import { ConnectionService } from '../../shared/services/connection.service';

@Injectable({
	providedIn: 'root',
})
export class CreateCandidateService {
	excel = inject(ExcelService);
	cService = inject(ConnectionService);

  /**
   * Asynchronously creates a candidate by processing the provided form data,
   * generating an Excel file, and sending the data along with the file to a service.
   *
   * @param candidateForm - The form data containing candidate information.
   * @returns A promise that resolves when the candidate data and file are successfully saved.
   *
   * The function performs the following steps:
   * 1. Extracts and processes the candidate form data.
   * 2. Constructs an object containing candidate details, including seniority, years of experience, and availability.
   * 3. Generates an Excel file based on the processed candidate data.
   * 4. Sends the candidate data and the generated Excel file to a service for saving.
   * 5. Logs a success message if the operation is successful.
   */
	createCandidate = async (candidateForm: CandidateFormInterface) => {

		const newExcelData: ExcelCandidateDataInterface = {
			seniority: candidateForm.seniority ?? Seniority.Junior,
			yearsExperience: candidateForm.yearsExperience ?? 0,
			availability: candidateForm.availability ?? false,
		};

		const requestData = {
			name: candidateForm.name,
			surname: candidateForm.surname,
			...newExcelData,
		};

		const blob = this.excel.exportToExcel([newExcelData]);
		const file = new File([blob], `${requestData.surname}_${requestData.name}`, {
			type: blob.type,
		});

		const resultado = await this.cService.saveFormDataWithExcel(requestData, file);

		if (resultado) {
			console.log('Datos y archivo guardados correctamente:', resultado);
		}
	};
}
