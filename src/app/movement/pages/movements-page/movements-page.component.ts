import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MovementFormComponent } from '../../components/movement-form/movement-form.component';

@Component({
  imports: [MovementFormComponent],
  templateUrl: './movements-page.component.html',
  styleUrl: './movements-page.component.css'
})
export class MovementsPageComponent {

}
