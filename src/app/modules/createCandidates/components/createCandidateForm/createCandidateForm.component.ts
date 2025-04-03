import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { FormUtils } from '../../../shared/utils/form.utils';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { ExcelService } from '../../../shared/services/excel.service';
import { ExcelCandidateDataInterface } from '../../../shared/interfaces/candidateForm.interface';
import { Seniority } from '../../../shared/interfaces/seniority.enum';
import { ConnectionService } from '../../../shared/services/connection.service';

@Component({
	selector: 'st-create-candidate-form',
	imports: [
		MatCardModule,
		MatButton,
		MatCheckboxModule,
		MatFormFieldModule,
		MatInputModule,
		MatRadioModule,
		ReactiveFormsModule,
	],
	templateUrl: './createCandidateForm.component.html',
	styleUrl: './createCandidateForm.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CreateCandidateFormComponent {
	private fb = inject(FormBuilder);
	private excel = inject(ExcelService);
	private cService = inject(ConnectionService);

	formUtils = FormUtils;

	candidateForm = this.fb.group({
		name: ['', [Validators.required]],
		surname: ['', [Validators.required]],
		seniority: [undefined, [Validators.required]],
		yearsExperience: [0, [Validators.required]],
		availability: [false],
	});

	onReset() {
		this.candidateForm.reset();
		this.candidateForm.patchValue({ yearsExperience: 0 });
	}

	async onSubmit() {
		if (this.candidateForm.invalid) {
			this.candidateForm.markAllAsTouched();
			return;
		}
		// console.log(this.candidateForm);

		// this.candidateForm.reset();
		// this.candidateForm.patchValue({ yearsExperience: 0 });

		if (this.candidateForm) {
			const formValues = this.candidateForm.value;

			const newExcelData: ExcelCandidateDataInterface = {
				seniority: this.candidateForm.get('seniority')?.value ?? Seniority.Junior,
				yearsExperience: this.candidateForm.get('yearsExperience')?.value ?? 0,
				availability: this.candidateForm.get('availability')?.value ?? false,
			};

			const requestData = {
				name: formValues.name,
				surname: formValues.surname,
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
		}
	}
}
