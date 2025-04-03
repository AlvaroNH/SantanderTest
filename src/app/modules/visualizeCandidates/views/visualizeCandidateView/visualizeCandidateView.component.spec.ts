import { TestBed } from '@angular/core/testing';
import { ConnectionService } from '@shared/services/connection.service';
import { of } from 'rxjs';
import moment from 'moment';
import VisualizeCandidateViewComponent from './visualizeCandidateView.component';
import { CandidateTable, Seniority } from '../../../shared/interfaces';

describe('VisualizeCandidateViewComponent', () => {
	let component: VisualizeCandidateViewComponent;
	let connectionServiceSpy: jasmine.SpyObj<ConnectionService>;

	beforeEach(() => {
		const spy = jasmine.createSpyObj('ConnectionService', ['getFormData']);

		TestBed.configureTestingModule({
			providers: [VisualizeCandidateViewComponent, { provide: ConnectionService, useValue: spy }],
		});

		component = TestBed.inject(VisualizeCandidateViewComponent);
		connectionServiceSpy = TestBed.inject(ConnectionService) as jasmine.SpyObj<ConnectionService>;
	});

	it('should load candidates data to table', (done) => {
		const mockData: CandidateTable[] = [
			{
				id: 1,
				created_at: new Date('2023-01-01T12:00:00Z'),
				name: 'Juan',
				surname: 'Pérez',
				seniority: Seniority.Junior,
				yearsExperience: 2,
				availability: true,
				excelfile: 'file1.xlsx',
			},
			{
				id: 2,
				created_at: new Date('2023-02-01T12:00:00Z'),
				name: 'Ana',
				surname: 'Gómez',
				seniority: Seniority.Senior,
				yearsExperience: 5,
				availability: false,
				excelfile: 'file2.xlsx',
			},
		];
		connectionServiceSpy.getFormData.and.returnValue(Promise.resolve(mockData));

		component.loadCandidatesData().then(() => {
			expect(component.candidates()).toEqual(mockData);
			expect(connectionServiceSpy.getFormData).toHaveBeenCalled();
			done();
		});
	});

	it('Should format creation date', () => {
		const date = '2023-01-01T12:00:00Z';
		const formattedDate = component.getFormatDate(date);

		expect(formattedDate).toEqual(moment(date).format('DD/MM/YYYY HH:mm:ss'));
	});
});
