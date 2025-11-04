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

export type Product = {
  id_producto?: number;
  borrado?: boolean;
  codigo?: string;
  nombre: string;
  descrip: string;
  stock_actual?: number;
  categoria: string;
  unidad: string;
  stock_minimo: number;
  id_proveedor?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  #http = inject(HttpClient);
  #authService = inject(AuthService);
  #products = signal<Product[] | null>([]);
  #product = signal<Product|null>(null);

  products = computed(() => this.#products());
  product = computed(()=>this.#product());

  private headers = {
    Authorization: `Bearer ${this.#authService.token()}`
  };

  getAllProducts() {
    return this.#http.get<TProductRespnse>(`${baseUrl}/product/list`, { headers: this.headers })
      .pipe(
        tap((res) => {
          console.log(res);
          this.#products.set(res.data);
        }),
        map(() => true),
        catchError((error) => {
          console.log(error.error);
          return of(false)
        })
      );
  }

  registerNewProduct(product: Product) {
    return this.#http.post<TProductRespnse>(`${baseUrl}/product/`, product, { headers: this.headers })
      .pipe(
        tap((res) => {
          console.log(res);
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

  getProductByCode(codigo: string) {
    console.log(codigo);
    return this.#http.get<{status:string,msg:string,data:Product}>(`${baseUrl}/product/${codigo}`, { headers: this.headers })
      .pipe(
        tap((res) => {
          console.log(res);
          this.#product.set(res.data)
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

  editProduct(product: Product) {
    return this.#http.post<TProductRespnse>(`${baseUrl}/product/edit`, product, { headers: this.headers })
      .pipe(
        tap((res) => {
          console.log(res);
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
          const prodsFilter = this.#products()!.filter(p => p.codigo !== codigo);
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
