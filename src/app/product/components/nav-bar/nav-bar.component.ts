import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  #router = inject(Router);
  #authServide = inject(AuthService);
  showMenuModal = signal<boolean>(false);

  links = [
    { name: 'Productos', link: '/product/products' },
    { name: 'Proveedores', link: '/supplier/suppliers' },
    { name: 'Clientes', link: '/client/clients' },
  ]
  onLogOut() {
    this.#authServide.logOut().subscribe(res=>{
      if(res){
        this.#router.navigate(['/auth/login']);
        this.closeModal();
      }
    })
  }

  onShowMenuModal(){
    this.showMenuModal.update((prev)=>!prev);
  }

  closeModal(){
    this.showMenuModal.set(false);
  }
}
