// * Angular core
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// * Angular Material
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';

// * Propios
import { CreateCandidateService } from '../../services/createCandidate.service';
import { FormUtils } from '@shared/utils/form.utils';
import { Seniority, CandidateFormInterface } from '@shared/interfaces';

@Component({
	selector: 'st-create-candidate-form',
	imports: [
		MatButton,
		MatCardModule,
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
	// * Inyecciones
	private fb = inject(FormBuilder);
	private _snackBar = inject(MatSnackBar);
	private ccService = inject(CreateCandidateService);

	formUtils = FormUtils;

	//* Computed property to get the list of seniority levels in order to iterate it
	seniority = computed(() => {
		return Object.entries(Seniority).map(([key, value]) => ({
			key,
			value,
		}));
	});

	candidateForm = this.fb.group({
		name: ['', [Validators.required]],
		surname: ['', [Validators.required]],
		seniority: [undefined, [Validators.required]],
		yearsExperience: [0, [Validators.required]],
		availability: [false],
	});

	/**
	 * Resets the candidate form to its initial state.
	 * This method clears all form fields and sets the `yearsExperience` field to 0.
	 */
	onReset() {
		this.candidateForm.reset();
		this.candidateForm.patchValue({ yearsExperience: 0 });
	}

	/**
	 * Handles the submission of the candidate creation form.
	 *
	 * This method validates the form, extracts its values, and sends the data
	 * to the candidate creation service. If the form is invalid, it marks all
	 * fields as touched to display validation errors. Upon successful submission,
	 * it displays a success message and resets the form. If an error occurs during
	 * the process, it logs the error and displays an error message.
	 *
	 * @async
	 * @returns {Promise<void>} A promise that resolves when the submission process is complete.
	 */
	async onSubmit() {
		if (this.candidateForm.invalid) {
			this.candidateForm.markAllAsTouched();
			return;
		}
		try {
			const formValue: CandidateFormInterface = {
				name: this.candidateForm.get('name')?.value ?? '',
				surname: this.candidateForm.get('surname')?.value ?? '',
				seniority: this.candidateForm.get('seniority')?.value ?? Seniority.Junior,
				yearsExperience: this.candidateForm.get('yearsExperience')?.value ?? 0,
				availability: this.candidateForm.get('availability')?.value ?? false,
			};

			if (this.candidateForm && this.candidateForm.value) {
				this.ccService.createCandidate(formValue);
			}
			this._snackBar.open('Candidato creado correctamente', 'Ok');

			this.candidateForm.reset();
			this.candidateForm.patchValue({ yearsExperience: 0 });
		} catch (error) {
			console.error(`Error al guardar los datos: ${error}`);
			this._snackBar.open('Ha habido un error al crear el candidato', 'Ouch');
		}
	}
}
