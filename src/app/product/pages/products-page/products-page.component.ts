import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { SuplierService } from '../../../supplier/services/suplier.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { MovementService } from '../../../movement/services/movement.service';

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
  currentPage = signal(0);
  #movsService = inject(MovementService);

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
    this.onFilter();
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

  onEntry(url: string, code?: string, tipo?: string) {
    this.productService.tipo.set(tipo!);
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

  // En tu MovementListComponent
  onReport() {
    this.#movsService.generateReport().subscribe(blob => {
      if (blob) {
      // 1. Crear un objeto URL a partir del Blob
      const url = window.URL.createObjectURL(blob);
      
      // 2. Crear un enlace temporal para forzar la descarga
      const a = document.createElement('a');
      a.href = url;
      // Usar el nombre que te da el servidor o uno genérico
      a.download = `reporte_movimientos_${new Date().toISOString()}.xlsx`; 
      document.body.appendChild(a);
      
      // 3. Simular el click para descargar
      a.click();
      
      // 4. Limpiar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
    });
  }

}
