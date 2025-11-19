import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { SuplierService } from '../../../supplier/services/suplier.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css'
})
export class ProductsPageComponent implements OnInit {
  productService = inject(ProductService);
  supplierService = inject(SuplierService);
  #router = inject(Router);
  showMenu = false
  #fb = inject(FormBuilder);
  pages = signal<number>(0);
  currentPage = signal(0)

  categories = [
    'Alimentos',
    'Bebidas',
    'Utencilios',
    'Limpieza',
    'Electrodomesticos',
    'Electrónica'
  ]

  arrPages = signal<number[]>([]);

  quantity = [1, 5, 10, 20]


  myForm = this.#fb.group({
    nombre: [''],
    categoria: [''],
    proveedor: ['']
  })

  limit = this.#fb.control('');



  constructor() {
    effect(() => {
      const totalPages = this.pages();

      // Crea un array de longitud 'totalPages' y lo mapea
      // _: valor (undefined), i: índice (0, 1, 2, 3...)
      const pgs = Array.from({ length: totalPages }, (_, i) => i + 1);
      this.arrPages.set(pgs);
      console.log(this.arrPages());
    })
  }

  ngOnInit(): void {
    //this.productService.getAllProducts().subscribe(r => console.log(r));
    this.supplierService.getSuppliers().subscribe();
  }

  onFilter(page?: number) {
    this.productService.filterProducts({
      nombre: this.myForm.get('nombre')?.value!,
      categoria: this.myForm.get('categoria')?.value!,
      proveedor: this.myForm.get('proveedor')?.value!,
      page: page,
      limit: this.limit.value!
    }).subscribe(r => {
      if (r) {
        this.pages.set(this.productService.metadata()?.totalPages!);
        this.currentPage.set(this.productService.metadata()?.currentPage!)
        this.limit.setValue(this.productService.metadata()?.limit.toString()!)
        
      }

    })
  }

  onDelete(codigo: string) {
    this.productService.deleteProducts(codigo).subscribe(r => console.log(r));
  }

  onEdit(url: string, code?: string) {
    this.#router.navigate([url, code])
  }

  onRedirect(url: string) {
    this.#router.navigate([url])
  }

  prevPage() {
    this.currentPage.update(v => v + 1)
    this.onFilter(this.currentPage())
  }

  backPage() {
    this.currentPage.update(v => v - 1);
    this.onFilter(this.currentPage())
  }

}
