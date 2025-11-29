import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { catchError, map, of, tap } from 'rxjs';

const baseUrl = environment.baseUrl;

// --- TIPOS DE DATOS PARA MOVIMIENTOS ---

export type Metadata = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: number;
  hasPrevPage: number;
  limit: number;
}

export type Movement = {
  id_movimiento?: number;
  tipo: 'Entrada' | 'Salida';
  fecha?: Date;
  cantidad: number;
  id_producto?: number;
  id_proveedor?: number | null; // Null si es salida
  id_cliente?: number | null;   // Null si es entrada

  // Propiedades para incluir en las respuestas de listado/detalle (opcional)
}

export type NewMovementData = {
  tipo: 'entrada' | 'salida';
  codigo: string; // Código del producto
  cantidad: number;
  // Responsable es el ID del Proveedor (para entrada) o Cliente (para salida)
  responsable: number | string;
}

export type TMovementResponse = {
  data: Movement[] | Movement | null;
  msg: string;
  status: string;
  metadata?: Metadata
}

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  #http = inject(HttpClient);
  #authService = inject(AuthService);

  // Estado reactivo para la lista de movimientos y metadata
  #movements = signal<Movement[] | null>([]);
  #metadata = signal<Metadata | null>(null);

  // Exponer el estado como computed
  movements = computed(() => this.#movements());
  metadata = computed(() => this.#metadata());

  private headers = {
    Authorization: `Bearer ${this.#authService.token()}`
  };

  /**
   * Registra un nuevo movimiento (Entrada o Salida).
   * Ruta POST: /movs/
   * @param data Datos del nuevo movimiento.
   */
  registerNewMovement(data: NewMovementData) {
    return this.#http.post<TMovementResponse>(`${baseUrl}/movs`, data, { headers: this.headers })
      .pipe(
        tap((res) => {
          console.log('Movimiento registrado:', res);
          this.#authService.showResponseByToast(res);
        }),
        map(() => true),
        catchError((error) => {
          console.log('Error al registrar movimiento:', error.error);
          this.#authService.showResponseByToast(error.error);
          return of(false);
        })
      );
  }

  generateReport() {
    return this.#http.get<any>(`${baseUrl}/movs/report`, { responseType:'blob' as 'json',headers: this.headers });
  }

}