import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-toast',
  imports: [NgClass],
  templateUrl: './custom-toast.component.html',
  styleUrl: './custom-toast.component.css'
})
export class CustomToastComponent {
  @Input() showToast:boolean = false
  @Input() typeMessage:string = 'info';
  @Input() message:string = 'mensaje'
}
