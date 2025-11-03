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
  id_producto:number;
  borrado: boolean;
  categoria:string;
  codigo:string;
  descip:string;
  id_proveedor:number;
  nombre:string;
  stock_actual:number;
  stock_minimo:number;
  unidad:string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  #http = inject(HttpClient);
  #authService = inject(AuthService);
  #products = signal<Product[] | null>([]);

  products = computed(() => this.#products());

  getAllProducts() {
    const headers = {
      Authorization: `Bearer ${this.#authService.token()}`
    };
    console.log({ headers });
    return this.#http.get<TProductRespnse>(`${baseUrl}/product/list`, { headers })
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
}
