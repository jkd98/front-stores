import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  imports: [],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css'
})
export default class ProductsPageComponent implements OnInit{
  productService = inject(ProductService);
  
  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(r=>console.log(r));  
  }

  onDelete(codigo:string){
    this.productService.deleteProducts(codigo).subscribe(r=>console.log(r));
  }
}
