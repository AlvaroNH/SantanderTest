// * Angular core
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	OnInit,
	signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// * Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

// * Propios
import { CandidateTable } from '@shared/interfaces/candidateTable.interface';
import { ConnectionService } from '@shared/services/connection.service';

// * Librerias
import moment from 'moment';

@Component({
	selector: 'app-visualize-candidate-view',
	imports: [
		CommonModule,
		MatButtonModule,
		MatCardModule,
		MatIconModule,
		MatTableModule,
		MatTooltipModule,
	],
	templateUrl: './visualizeCandidateView.component.html',
	styleUrl: './visualizeCandidateView.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class VisualizeCandidateViewComponent implements OnInit {
	private cService = inject(ConnectionService);

	candidates = signal<CandidateTable[]>([]);
	columns = computed(() => {
		if (this.candidates().length > 0) {
			const columns = Object.keys(this.candidates()[0]);
			const orderedColumns = columns.filter((col) => col !== 'created_at' && col !== 'excelfile');
			orderedColumns.push('created_at', 'excelfile');
			return orderedColumns;
		}
		return [];
	});

	/**
	 * Asynchronously loads candidate data from the service and updates the internal state.
	 *
	 * This method retrieves form data using the `cService` and, if data is available,
	 * stores it in the `candidates` signal. It also logs the loaded data to the console.
	 *
	 * @returns {Promise<void>} A promise that resolves when the data is loaded and processed.
	 */
	public async loadCandidatesData() {
		const data = await this.cService.getFormData();
		if (data) {
			this.candidates.set(data); // Guarda los datos en la señal
		}
	}

	/**
	 * Formats a given date string into the format "DD/MM/YYYY HH:mm:ss".
	 *
	 * @param date - The date string to be formatted.
	 * @returns The formatted date string in "DD/MM/YYYY HH:mm:ss" format.
	 */
	getFormatDate(date: string): string {
		const momentDate = moment(date);
		return momentDate.format('DD/MM/YYYY HH:mm:ss');
	}

	/**
	 * Lifecycle hook that is called after Angular has initialized all data-bound properties of a component.
	 * This method is used to load the candidate data when the component is initialized.
	 *
	 * @returns {void}
	 */
	ngOnInit(): void {
		this.loadCandidatesData();
	}
}
