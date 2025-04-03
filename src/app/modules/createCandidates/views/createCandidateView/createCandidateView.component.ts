import { ChangeDetectionStrategy, Component } from '@angular/core';
import CreateCandidateFormComponent from '../../components/createCandidateForm/createCandidateForm.component';

@Component({
	selector: 'app-create-candidate-view',
	imports: [CreateCandidateFormComponent],
	templateUrl: './createCandidateView.component.html',
	styleUrl: './createCandidateView.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CreateCandidateViewComponent {}
