import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, of, tap } from 'rxjs';
import { CustomToastService } from '../../shared/services/custom-toast.service';



export type Proveedor = {
  showMenu?: boolean;
  id_proveedor: number;
  nombre: string;
  telf: string;
  contacto: string;
}


const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class SuplierService {
  #proveedores = signal<Proveedor[]>([]);
  #toast = inject(CustomToastService);
  #proveedor = signal<Proveedor | null>(null);

  proveedores = computed(() => this.#proveedores());
  proveedor = computed(() => this.#proveedor());

  constructor() { }
  #http = inject(HttpClient)

  getSuppliers() {
    return this.#http.get<{ status: string; msg: string; data: Proveedor[]; }>(`${baseUrl}/proveedor/`)
      .pipe(
        tap(res => { //Para manejar estados, actualizacion de variables, cuando res = 200 ok
          this.#proveedores.set(res.data)
          console.log(res);
        }),
        map(() => true),
        catchError(error => {
          console.log(error);
          this.#toast.renderToast(error.error.msg, error.error.status);
          return of(false)
        })
      )
  }

  addSupplier(data: { nombre: string; telf: string; contacto: string }) {
    return this.#http.post<{ status: string; msg: string }>(`${baseUrl}/proveedor/`, data)
      .pipe(
        tap(res => {
          this.#toast.renderToast(res.msg, res.status);
        }),
        map(() => true),
        catchError(error => {
          console.log(error);
          this.#toast.renderToast(error.error.msg, error.error.status);
          return of(false); // nuevo observable para no detener el flujo
        })
      )
  }

  getOneSupplier(id_proveedor: Proveedor['id_proveedor']) {
    return this.#http.post<{ status: string; msg: string; data: Proveedor }>(`${baseUrl}/proveedor/one`, { id_proveedor })
      .pipe(
        tap(res => {
          this.#proveedor.set(res.data);
          this.#toast.renderToast(res.msg, res.status);
        }),
        map(() => true),
        catchError(error => {
          console.log(error);
          this.#toast.renderToast(error.error.msg, error.error.status);
          return of(false); // nuevo observable para no detener el flujo
        })
      )
  }

  editSupplier(data: { id_proveedor: string, nombre: string; telf: string; contacto: string }) {
    return this.#http.post<{ status: string; msg: string }>(`${baseUrl}/proveedor/edit`, data)
      .pipe(
        tap(res => {
          this.#toast.renderToast(res.msg, res.status);
        }),
        map(() => true),
        catchError(error => {
          console.log(error);
          this.#toast.renderToast(error.error.msg, error.error.status);
          return of(false); // nuevo observable para no detener el flujo
        })
      )
  }

  deleteSupplier(contacto: Proveedor['contacto']) {
    return this.#http.post<{ status: string; msg: string }>(`${baseUrl}/proveedor/delete`, { contacto })
      .pipe(
        tap(res => {
          this.#toast.renderToast(res.msg, res.status);
          const updated = this.#proveedores().filter(p => p.contacto !== contacto);
          this.#proveedores.set(updated);
        }),
        map(() => true),
        catchError(error => {
          console.log(error);
          this.#toast.renderToast(error.error.msg, error.error.status);
          return of(false); // nuevo observable para no detener el flujo
        })
      )
  }

  onShowMenu(supplier: Proveedor) {
    this.proveedores()!.forEach(p => {
      if (p !== supplier) {
        p.showMenu = false
      }
    });
    supplier.showMenu = !supplier.showMenu;
  }
}
