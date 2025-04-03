import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateCandidateService } from '../../services/createCandidate.service';
import { of } from 'rxjs';
import CreateCandidateFormComponent from './createCandidateForm.component';
import { Seniority } from '../../../shared/interfaces';

describe('CreateCandidateFormComponent', () => {
	let component: CreateCandidateFormComponent;
	let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
	let createCandidateServiceSpy: jasmine.SpyObj<CreateCandidateService>;

	beforeEach(() => {
		const snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
		const createCandidateServiceMock = jasmine.createSpyObj('CreateCandidateService', [
			'createCandidate',
		]);

		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule],
			providers: [
				CreateCandidateFormComponent,
				{ provide: MatSnackBar, useValue: snackBarMock },
				{ provide: CreateCandidateService, useValue: createCandidateServiceMock },
			],
		});

		component = TestBed.inject(CreateCandidateFormComponent);
		snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
		createCandidateServiceSpy = TestBed.inject(
			CreateCandidateService,
		) as jasmine.SpyObj<CreateCandidateService>;
	});

	it('should reset form to empty values', () => {
		component.candidateForm.setValue({
			name: 'John',
			surname: 'Doe',
			seniority: Seniority.Senior,
			yearsExperience: 5,
			availability: true,
		});

		component.onReset();

		expect(component.candidateForm.value).toEqual({
			name: null,
			surname: null,
			seniority: null,
			yearsExperience: 0,
			availability: null,
		});
	});

	it('should have create the candidate and warn the user', async () => {
		component.candidateForm.setValue({
			name: 'John',
			surname: 'Doe',
			seniority: Seniority.Senior,
			yearsExperience: 5,
			availability: true,
		});

		createCandidateServiceSpy.createCandidate;

		await component.onSubmit();

		expect(createCandidateServiceSpy.createCandidate).toHaveBeenCalledWith({
			name: 'John',
			surname: 'Doe',
			seniority: Seniority.Senior,
			yearsExperience: 5,
			availability: true,
		});
		expect(snackBarSpy.open).toHaveBeenCalledWith('Candidato creado correctamente', 'Ok');
	});
});
