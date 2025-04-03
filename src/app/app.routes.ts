import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./modules/home/views/homePage/homePage.component'),
	},
	{
		path: 'add-candidates',
		loadComponent: () =>
			import('./modules/createCandidates/views/createCandidateView/createCandidateView.component'),
	},
	{
		path: 'view-candidates',
		loadComponent: () =>
			import(
				'./modules/visualizeCandidates/views/visualizeCandidateView/visualizeCandidateView.component'
			),
	},
	{
		path: '**',
		redirectTo: '',
	},
];
