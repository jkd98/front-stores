import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { catchError, map, of, tap } from 'rxjs';

const baseUrl = environment.baseUrl;

export type TProductRespnse = {
  data: Product[] | null;
  msg: string;
  status: string;
}

type Product = {
  id_producto: number;
  borrado: boolean;
  categoria: string;
  codigo: string;
  descip: string;
  id_proveedor: number;
  nombre: string;
  stock_actual: number;
  stock_minimo: number;
  unidad: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  #http = inject(HttpClient);
  #authService = inject(AuthService);
  #products = signal<Product[] | null>([]);

  products = computed(() => this.#products());
  private headers = {
    Authorization: `Bearer ${this.#authService.token()}`
  };
  getAllProducts() {
    return this.#http.get<TProductRespnse>(`${baseUrl}/product/list`, { headers: this.headers })
      .pipe(
        tap((res) => {
          console.log(res);
          this.#products.set(res.data);
          this.#authService.showResponseByToast(res);
        }),
        map(() => true),
        catchError((error) => {
          console.log(error.error);
          this.#authService.showResponseByToast(error.error);
          return of(false)
        })
      );
  }

  deleteProducts(codigo: string) {
    console.log(codigo);
    return this.#http.post<TProductRespnse>(`${baseUrl}/product/delete`, { codigo }, { headers: this.headers })
      .pipe(
        tap((res) => {
          console.log(res);
          const prodsFilter = this.#products()!.filter(p=>p.codigo!==codigo);
          this.#products.set(prodsFilter);
          this.#authService.showResponseByToast(res);
        }),
        map(() => true),
        catchError((error) => {
          console.log(error.error);
          this.#authService.showResponseByToast(error.error);
          return of(false)
        })
      );
  }
}
