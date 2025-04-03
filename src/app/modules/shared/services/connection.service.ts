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
					throw new Error('Error al subir el archivo: ' + uploadError.message);
				}

				const { data } = this.supabase.storage.from('excels').getPublicUrl(archivoName);
				archivoUrl = data.publicUrl;
			}

			const { data, error: insertError } = await this.supabase
				.from('formdata')
				.insert([{ ...formData, excelfile: archivoUrl }]);

			if (insertError) {
				throw new Error('Error al guardar los datos: ' + insertError.message);
			}

			return data;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

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
	 * Realiza login con un usuario de prueba.
	 */
	async loginDummyUser() {
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
