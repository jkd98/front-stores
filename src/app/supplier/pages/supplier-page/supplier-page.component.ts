import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SuplierService } from '../../services/suplier.service';

@Component({
  imports: [],
  templateUrl: './supplier-page.component.html',
  styleUrl: './supplier-page.component.css'
})
export class SupplierPageComponent implements OnInit{
  #router = inject(Router);
  supplierService =inject(SuplierService);
  ngOnInit(): void {
    this.supplierService.getSuppliers().subscribe();
  }

  onRedirect(url: string) {
    this.#router.navigate([url])
  }

  onDelete(contacto:string){
    this.supplierService.deleteSupplier(contacto).subscribe()
  }

  onEdit(id:number){
    this.#router.navigate(['/supplier/edit',id]);
  }

}
