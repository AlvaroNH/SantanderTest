import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'st-home-page',
	imports: [RouterLink, MatButtonModule, MatIconModule],
	templateUrl: './homePage.component.html',
	styleUrl: './homePage.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePageComponent {}
