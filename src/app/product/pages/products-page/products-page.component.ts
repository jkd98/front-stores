import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  imports: [],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css'
})
export default class ProductsPageComponent implements OnInit{
  productService = inject(ProductService);
  #router = inject(Router);
  
  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(r=>console.log(r));  
  }

  onDelete(codigo:string){
    this.productService.deleteProducts(codigo).subscribe(r=>console.log(r));
  }

  onRedirect(){
    this.#router.navigate(['/product/new-product'])
  }
}
