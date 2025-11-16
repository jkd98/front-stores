import { Component, inject, OnInit } from '@angular/core';
import { ErrorFieldComponent } from '../../../auth/components/error-field/error-field.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SuplierService } from '../../services/suplier.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-supplier-form',
  imports: [ErrorFieldComponent, ReactiveFormsModule],
  templateUrl: './supplier-form.component.html',
  styleUrl: '../../../product/components/product-form/product-form.component.css'
})
export class SupplierFormComponent implements OnInit {

  code: string | null = null;
  fb = inject(FormBuilder);
  #supplierServ = inject(SuplierService);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  myForm!: FormGroup;

  ngOnInit(): void {
    this.myForm = this.fb.group({
      nombre: ['', [Validators.required]],
      telf: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      contacto: ['', [Validators.required, Validators.email]]
    });
    this.#route.paramMap.subscribe(p => {
      this.code = p.get('code');
      if (this.code) {
        this.patchForm(Number(this.code));
      }
    })
  }

  getFormControl(name: string) {
    return this.myForm.get(name);
  }

  onEdit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const data = {
      id_proveedor:this.code!,
      nombre: this.myForm.get('nombre')?.value!,
      telf: this.myForm.get('telf')?.value!,
      contacto: this.myForm.get('contacto')?.value!
    }

    this.#supplierServ.editSupplier(data).subscribe(res => {
      if (res) {
        this.#router.navigate(['/supplier/suppliers']);
      }
    });
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const data = {
      nombre: this.myForm.get('nombre')?.value!,
      telf: this.myForm.get('telf')?.value!,
      contacto: this.myForm.get('contacto')?.value!
    }

    this.#supplierServ.addSupplier(data).subscribe(res => {
      if (res) {
        this.#router.navigate(['/supplier/suppliers']);
      }
    });
  }

  patchForm(id_proveedor: number) {
    this.#supplierServ.getOneSupplier(id_proveedor).subscribe((r) => {
      if (r) {
        this.myForm.patchValue({
          nombre: this.#supplierServ.proveedor()?.nombre,
          telf: this.#supplierServ.proveedor()?.telf,
          contacto: this.#supplierServ.proveedor()?.contacto
        })
      }
    })
  }

}
