import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [NavBarComponent,RouterOutlet],
  templateUrl: './product-layout.component.html',
  styleUrl: './product-layout.component.css'
})
export  class ProductLayoutComponent {
  
  
}
