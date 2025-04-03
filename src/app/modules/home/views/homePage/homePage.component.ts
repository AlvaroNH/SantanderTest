import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
@Component({
	selector: 'st-home-page',
	imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
	templateUrl: './homePage.component.html',
	styleUrl: './homePage.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePageComponent {}
