import { Component, inject, OnInit } from '@angular/core';
import { ErrorFieldComponent } from '../../../auth/components/error-field/error-field.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../../client/services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../product/services/product.service';
import { SuplierService } from '../../../supplier/services/suplier.service';
import { MovementService } from '../../services/movement.service';

@Component({
  selector: 'app-movement-form',
  imports: [ReactiveFormsModule, ErrorFieldComponent],
  templateUrl: './movement-form.component.html',
  styleUrl: '../../../product/components/product-form/product-form.component.css'
})
export class MovementFormComponent implements OnInit {
  code: string | null = null;
  fb = inject(FormBuilder);
  clientServ = inject(ClientService);
  productService = inject(ProductService);
  supliersServ = inject(SuplierService);

  #router = inject(Router);
  #route = inject(ActivatedRoute);
  myForm!: FormGroup;
  movementsTipo = ['entrada', 'salida']
  movementService = inject(MovementService);

  ngOnInit(): void {
    this.supliersServ.getSuppliers().subscribe();
    this.clientServ.getClients().subscribe();

    this.myForm = this.fb.group({
      tipo: ['', [Validators.required]],
      cantidad: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      responsable: ['', [Validators.required]]
    });

    this.#route.paramMap.subscribe(p => {
      this.code = p.get('code');
      this.productService.getProductByCode(this.code!).subscribe();
      this.myForm.patchValue({ tipo: this.productService.tipo() });
      if(this.productService.tipo() === 'ninguna'){
        this.#router.navigate(['/product/products']);
      }
    })
  }

  getFormControl(name: string) {
    return this.myForm.get(name);
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const data = {
      tipo: this.myForm.get('tipo')?.value!,
      codigo: this.code!,
      cantidad: this.myForm.get('cantidad')?.value!,
      responsable: this.myForm.get('responsable')?.value!
    }
    console.log(data);

    this.movementService.registerNewMovement(data).subscribe(r=>{
      if(r){
        this.productService.filterProducts({nombre:this.productService.product()?.nombre,limit:'1'}).subscribe();
        this.#router.navigate(['/product/products']);
      }
    })
  }

}
