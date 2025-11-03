import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { catchError, map, of, tap } from 'rxjs';

const baseUrl = environment.baseUrl;

export type TProductRespnse = {
  data: [] | null;
  msg: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  #http = inject(HttpClient);
  #authService = inject(AuthService);
  #products = signal<[] | null>([]);

  products = computed(() => this.#products());

  getAllProducts() {
    const headers = {
      Authorization: `Bearer ${this.#authService.token()}`
    };
    return this.#http.get<TProductRespnse>(`${baseUrl}/product/`,{headers})
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
