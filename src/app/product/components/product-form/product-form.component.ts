import { Component, inject, OnInit } from '@angular/core';
import { ErrorFieldComponent } from '../../../auth/components/error-field/error-field.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, ErrorFieldComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {


  #fb = inject(FormBuilder);
  #productService = inject(ProductService);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  newProductForm!: FormGroup;
  code: string = '';

  unidad = [
    'Litros',
    'Metros',
    'Piezas',
    'Kilos'
  ]

  categories = [
    'Alimentos',
    'Bebidas',
    'Utencilios',
    'Limpieza',
    'Electrodomesticos',
    'Electrónica'
  ]

  ngOnInit(): void {
    this.newProductForm = this.#fb.group({
      nombre: ['Producto', [Validators.required]],
      descrip: ['Este es un nuevo producto', [Validators.required]],
      categoria: ['', [Validators.required]],
      unidad: ['', [Validators.required]],
      stock_minimo: ['', [Validators.required, Validators.min(10), Validators.max(1000)]],
      id_proveedor: ['2', [Validators.required]],
    });
    this.#route.paramMap.subscribe(params => {
      this.code = params.get('code') || '';
      let product: Product | null;

      if (this.code) {
        this.#productService.getProductByCode(this.code).subscribe(r => {
          if (r) {
            product = this.#productService.product();
            this.newProductForm.patchValue({
              nombre: product?.nombre,
              descrip: product?.descrip,
              categoria: product?.categoria,
              unidad: product?.unidad,
              stock_minimo: product?.stock_minimo,
            })
          }
        })
      }
    })
  }


  getFormControl(name: string) {
    return this.newProductForm.get(name);
  }

  onSubmit() {
    if (this.newProductForm.invalid) {
      this.newProductForm.markAllAsTouched();
      return;
    }
    //console.log(this.newProductForm.value)
    this.#productService.registerNewProduct({
      nombre: this.newProductForm.get('nombre')?.value!,
      descrip: this.newProductForm.get('descrip')?.value!,
      categoria: this.newProductForm.get('categoria')?.value!,
      unidad: this.newProductForm.get('unidad')?.value!,
      stock_minimo: Number(this.newProductForm.get('stock_minimo')?.value!),
      id_proveedor: Number(this.newProductForm.get('id_proveedor')?.value!),
    }).subscribe(r => {
      if (r) {
        this.#router.navigate(['/product/products']);
      }
    });
  }

  onEdit() {
    if (this.newProductForm.invalid) {
      this.newProductForm.markAllAsTouched();
      return;
    }
    //console.log(this.newProductForm.value)
    this.#productService.editProduct({
      codigo:this.code,
      nombre: this.newProductForm.get('nombre')?.value!,
      descrip: this.newProductForm.get('descrip')?.value!,
      categoria: this.newProductForm.get('categoria')?.value!,
      unidad: this.newProductForm.get('unidad')?.value!,
      stock_minimo: Number(this.newProductForm.get('stock_minimo')?.value!),
    }).subscribe(r => {
      if (r) {
        this.#router.navigate(['/product/products']);
      }
    });
  }
}
