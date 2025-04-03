import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '@env/environment.development';
import { CandidateTable } from '@shared/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ConnectionService {
	private supabaseUrl: string = environment.APP_SUPABASE_URL;
	private supabaseKey: string = environment.APP_SUPABASE_ANON_KEY;
	private supabase = createClient(this.supabaseUrl, this.supabaseKey);

	/**
	 * Saves form data along with an optional Excel file to the database.
	 *
	 * This method first checks if the user is authenticated. If not, it returns `null`.
	 * If an Excel file is provided, it uploads the file to the Supabase storage bucket
	 * named 'excels' and retrieves its public URL. The form data, along with the URL
	 * of the uploaded file, is then inserted into the 'formdata' table in the database.
	 *
	 * @param formData - The form data to be saved.
	 * @param archivo - The Excel file to be uploaded (optional).
	 * @returns A promise that resolves to the inserted data if successful, or `null` if
	 *          an error occurs or the user is not authenticated.
	 * @throws An error if there is an issue uploading the file or inserting the data.
	 */
	async saveFormDataWithExcel(formData: any, archivo: File) {
		const isAuthenticated = await this.checkAuth();
		if (!isAuthenticated) return null;
		try {
			let archivoUrl: string | null = null;

			if (archivo) {
				const archivoName = `${Date.now()}-${archivo.name}.xlsx`;

				const { error: uploadError } = await this.supabase.storage
					.from('excels')
					.upload(archivoName, archivo);

				if (uploadError) {
					throw new Error(`Error al subir el archivo: ${uploadError.message}`);
				}

				const { data } = this.supabase.storage.from('excels').getPublicUrl(archivoName);
				archivoUrl = data.publicUrl;
			} else {
				throw new Error('No existe el archivo');
			}

			const { data, error: insertError } = await this.supabase
				.from('formdata')
				.insert([{ ...formData, excelfile: archivoUrl }]);

			if (insertError) {
				throw new Error(`Error al insertar los datos en tabla: ${insertError.message}`);
			}

			return data;
		} catch (error) {
			throw new Error(`Error al guardar los datos: ${error}`);
			return null;
		}
	}

	/**
	 * Retrieves form data from the 'formdata' table in the Supabase database.
	 *
	 * @returns {Promise<CandidateTable[]>} A promise that resolves to an array of `CandidateTable` objects.
	 * @throws {Error} Throws an error if the user is not authenticated or if there is an issue retrieving the data.
	 */
	async getFormData(): Promise<CandidateTable[]> {
		const isAuthenticated = await this.checkAuth();
		if (!isAuthenticated) throw new Error('No authenticated');

		const { data, error } = await this.supabase.from('formdata').select('*');
		if (error) {
			console.error();
			throw new Error('Error al obtener los registros:', error);
		}
		return data;
	}

	/**
	 * Checks the authentication status of the current user.
	 *
	 * This method attempts to retrieve the current user and session information
	 * from the Supabase authentication service. If a user is authenticated, it
	 * returns `true`. If no user is authenticated, it attempts to log in with a
	 * dummy user. If the dummy user login fails, it logs an error and returns `false`.
	 *
	 * @returns {Promise<boolean>} A promise that resolves to `true` if the user is authenticated,
	 * or `false` if authentication fails.
	 */
	async checkAuth(): Promise<boolean> {
		const { data, error } = await this.supabase.auth.getUser();
		const { data: session, error: sessionError } = await this.supabase.auth.getSession();

		console.log('session:', session);
		console.log('sessionError: ', sessionError);

		if (data?.user) {
			console.log('Usuario autenticado:', data.user);
			return true;
		} else {
			// Intentar autenticarse con el usuario de prueba
			await this.loginDummyUser();
			const { data, error } = await this.supabase.auth.getUser();

			if (error || !data?.user) {
				console.error('Error al autenticar:', error);
				return false;
			}
			return true;
		}
	}

	/**
	 * Authenticates a dummy user using predefined credentials.
	 *
	 * This method attempts to sign in a dummy user with a hardcoded email and password
	 * using the Supabase authentication service. It logs the result of the operation
	 * to the console, either as an error or a successful authentication.
	 *
	 * @async
	 * @returns {Promise<void>} A promise that resolves when the authentication process completes.
	 *
	 * @remarks
	 * - Ensure that the Supabase client is properly initialized before calling this method.
	 * - This method is intended for testing purposes and should not be used in production.
	 *
	 * @example
	 * ```typescript
	 * const connectionService = new ConnectionService();
	 * await connectionService.loginDummyUser();
	 * ```
	 */
	async loginDummyUser(): Promise<void> {
		const { data, error } = await this.supabase.auth.signInWithPassword({
			email: 'santander-technicaltest@example.com',
			password: '123456789',
		});

		if (error) {
			console.error('Error en el login:', error);
		} else {
			console.log('Usuario de prueba autenticado:', data);
		}
	}
}
