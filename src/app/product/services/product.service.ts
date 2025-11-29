import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { catchError, map, of, tap } from 'rxjs';
import { Proveedor } from '../../supplier/services/suplier.service';

const baseUrl = environment.baseUrl;

export type TProductRespnse = {
  data: Product[] | null;
  msg: string;
  status: string;
  metadata?: Metadata
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
  showMenu?: boolean;
  proveedor?: Proveedor
}

type Metadata = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: number;
  hasPrevPage: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  #http = inject(HttpClient);
  #authService = inject(AuthService);
  #products = signal<Product[] | null>([]);
  #product = signal<Product | null>(null);
  #metadata = signal<Metadata | null>(null);
  tipo = signal('ninguna')

  products = computed(() => { console.log(this.metadata()); return this.#products() });
  product = computed(() => this.#product());
  metadata = computed(() => this.#metadata());

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
    return this.#http.get<{ status: string, msg: string, data: Product }>(`${baseUrl}/product/${codigo}`, { headers: this.headers })
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

  onShowMenu(product: Product) {
    this.products()!.forEach(p => {
      if (p !== product) {
        p.showMenu = false
      }
    });
    product.showMenu = !product.showMenu;
  }

  filterProducts(filters: { nombre?: string, categoria?: string, proveedor?: string, page?: string | number | null, limit?: string | null }) {
    console.log(filters)
    let query = '';
    if (filters.page && filters.limit !== '') {
      query = `?page=${Number(filters.page)}&limit=${Number(filters.limit)}`;
    } else if (filters.page) {
      query = `?page=${Number(filters.page)}`;
    } else if (filters.limit !== '') {
      query = `?limit=${Number(filters.limit)}`;
    }


    return this.#http.post<TProductRespnse>(`${baseUrl}/product/filter${query}`, filters, { headers: this.headers })
      .pipe(
        tap((res) => {
          console.log(res);
          this.#products.set(res.data);
          this.#metadata.set(res.metadata!)
          console.log(this.#metadata());
        }),
        map(() => true),
        catchError((error) => {
          console.log(error.error);
          return of(false)
        })
      );
  }
}
