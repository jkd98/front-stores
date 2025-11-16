import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorFieldComponent } from '../../../auth/components/error-field/error-field.component';
import { ClientService } from '../../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule, ErrorFieldComponent],
  templateUrl: './client-form.component.html',
  styleUrl: '../../../product/components/product-form/product-form.component.css'
})
export class ClientFormComponent implements OnInit {

  code: string | null = null;
  fb = inject(FormBuilder);
  #clientServ = inject(ClientService);
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
      id_cliente: this.code!,
      nombre: this.myForm.get('nombre')?.value!,
      telf: this.myForm.get('telf')?.value!,
      contacto: this.myForm.get('contacto')?.value!
    }

    this.#clientServ.editClient(data).subscribe(res => {
      if (res) {
        this.#router.navigate(['/client/clients']);
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

    this.#clientServ.addClient(data).subscribe(res => {
      if (res) {
        this.#router.navigate(['/client/clients']);
      }
    });
  }

  patchForm(id_cliente: number) {
    this.#clientServ.getClientById(id_cliente).subscribe((r) => {
      if (r) {
        this.myForm.patchValue({
          nombre: this.#clientServ.client()?.nombre,
          telf: this.#clientServ.client()?.telf,
          contacto: this.#clientServ.client()?.contacto
        })
      }
    })
  }

}
