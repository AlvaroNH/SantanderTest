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
			return Object.keys(this.candidates()[0]);
		}
		return [];
	});

	public async loadCandidatesData() {
		const data = await this.cService.getFormData();
		if (data) {
			this.candidates.set(data); // Guarda los datos en la señal
		}
		console.log('Data:', this.candidates());
	}

	getFormatDate(date: string): string {
		const momentDate = moment(date);
		return momentDate.format('DD/MM/YYYY HH:mm:ss');
	}

	ngOnInit(): void {
		this.loadCandidatesData(); // Carga los datos al inicializar el componente
	}
}
