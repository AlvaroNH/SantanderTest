import { FormArray, FormGroup, ValidationErrors } from '@angular/forms';

export class FormUtils {
	/**
	 * Retrieves a user-friendly error message based on the provided validation errors.
	 *
	 * @param errors - An object containing validation errors, where each key represents
	 *                 a specific validation rule that failed.
	 *
	 * @returns A string representing the error message for the first validation error found,
	 *          or `null` if no errors are present.
	 *
	 * @example
	 * ```typescript
	 * const errors = { required: true };
	 * const message = getTextError(errors);
	 * console.log(message); // Output: "Este campo es requerido"
	 * ```
	 *
	 * @remarks
	 * Supported validation error keys:
	 * - `required`: Indicates that the field is required.
	 * - `minlength`: Indicates that the field does not meet the minimum character length.
	 * - `min`: Indicates that the field value is below the minimum allowed value.
	 */
	static getTextError(errors: ValidationErrors) {
		for (const key of Object.keys(errors)) {
			switch (key) {
				case 'required':
					return 'Este campo es requerido';

				case 'minlength':
					return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;

				case 'min':
					return `Valor mínimo de ${errors['min'].min}`;
			}
		}

		return null;
	}

	/**
	 * Checks if a specific field in a form is valid.
	 *
	 * @param form - The FormGroup instance containing the form controls.
	 * @param fieldName - The name of the field to validate.
	 * @returns `true` if the field has errors and has been touched, otherwise `false`.
	 */
	static isValidField(form: FormGroup, fieldName: string): boolean | null {
		return !!form.controls[fieldName].errors && form.controls[fieldName].touched;
	}

	/**
	 * Retrieves the error message for a specific form field in a FormGroup.
	 *
	 * @param form - The FormGroup containing the form controls.
	 * @param fieldName - The name of the field whose error message is to be retrieved.
	 * @returns The error message as a string if errors exist, or `null` if the field has no errors or does not exist.
	 */
	static getFieldError(form: FormGroup, fieldName: string): string | null {
		if (!form.controls[fieldName]) return null;

		const errors = form.controls[fieldName].errors ?? {};

		return FormUtils.getTextError(errors);
	}

	/**
	 * Checks if a specific field in a FormArray is valid by verifying if it has errors
	 * and has been touched.
	 *
	 * @param formArray - The FormArray containing the controls to validate.
	 * @param index - The index of the control within the FormArray to check.
	 * @returns `true` if the field has errors and has been touched, otherwise `false`.
	 */
	static isValidFieldInArray(formArray: FormArray, index: number) {
		return formArray.controls[index].errors && formArray.controls[index].touched;
	}

	/**
	 * Retrieves the error message for a specific control within a `FormArray` at the given index.
	 *
	 * @param formArray - The `FormArray` containing the controls to check for errors.
	 * @param index - The index of the control within the `FormArray` to retrieve the error from.
	 * @returns A string representing the error message if an error exists, or `null` if no errors are found.
	 */
	static getFieldErrorInArray(formArray: FormArray, index: number): string | null {
		if (formArray.controls.length === 0) return null;

		const errors = formArray.controls[index].errors ?? {};

		return FormUtils.getTextError(errors);
	}
}
