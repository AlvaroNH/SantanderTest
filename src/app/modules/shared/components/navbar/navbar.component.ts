import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';

import { RouterLink } from '@angular/router';

@Component({
	selector: 'st-navbar',
	imports: [MatToolbarModule, MatSlideToggleModule, RouterLink, MatButtonModule, MatIconModule],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NavbarComponent {}
