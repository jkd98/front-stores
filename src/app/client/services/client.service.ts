import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, of, tap } from 'rxjs';
import { CustomToastService } from '../../shared/services/custom-toast.service';
import { AuthService } from '../../auth/services/auth.service';

type Client = {
  showMenu?: boolean;
  id_cliente: number;
  nombre: string;
  telf: string;
  contacto: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  #baseUrl = environment.baseUrl;
  #clients = signal<Client[]>([]);
  clients = (() => this.#clients());
  #client = signal<Client | null>(null);
  client = computed(() => this.#client());

  #http = inject(HttpClient);
  #toast = inject(CustomToastService);
  #authService = inject(AuthService);
  private headers = {
    Authorization: `Bearer ${this.#authService.token()}`
  };
  getClients() {
    return this.#http.get<{ status: string, msg: string, data: Client[] }>(`${this.#baseUrl}/cliente/`,{ headers: this.headers })
      .pipe(
        tap(res => {
          this.#clients.set(res.data);
        }),
        map(() => true),
        catchError(error => {
          this.#toast.renderToast(error.error.msg, error.error.status);
          return of(false)
        })
      )
  }

  getClientById(id_cliente: Client['id_cliente']) {
    return this.#http.post<{ status: string, msg: string, data: Client }>(`${this.#baseUrl}/cliente/one`, { id_cliente },{ headers: this.headers })
      .pipe(
        tap(res => {
          this.#client.set(res.data);
          this.#toast.renderToast(res.msg, res.status);
        }),
        map(() => true),
        catchError(error => {
          this.#toast.renderToast(error.error.msg, error.error.status);
          return of(false)
        })
      )
  }

  addClient(data: { nombre: string; telf: string; contacto: string }) {
    return this.#http.post<{ status: string, msg: string }>(`${this.#baseUrl}/cliente/`, data,{ headers: this.headers })
      .pipe(
        tap(res => {
          this.#toast.renderToast(res.msg, res.status);
        }),
        map(() => true),
        catchError(error => {
          this.#toast.renderToast(error.error.msg, error.error.status);
          return of(false)
        })
      )
  }

  editClient(data: { id_cliente: string, nombre: string; telf: string; contacto: string }) {
    return this.#http.post<{ status: string, msg: string }>(`${this.#baseUrl}/cliente/edit`, data,{ headers: this.headers })
      .pipe(
        tap(res => {
          this.#toast.renderToast(res.msg, res.status);
        }),
        map(() => true),
        catchError(error => {
          this.#toast.renderToast(error.error.msg, error.error.status);
          return of(false)
        })
      )
  }

  deleteClient(contacto: Client['contacto']) {
    return this.#http.post<{ status: string, msg: string }>(`${this.#baseUrl}/cliente/delete`, { contacto },{ headers: this.headers })
      .pipe(
        tap(res => {
          this.#toast.renderToast(res.msg, res.status);
          const updated = this.#clients().filter(p => p.contacto !== contacto);
          this.#clients.set(updated);

        }),
        map(() => true),
        catchError(error => {
          this.#toast.renderToast(error.error.msg, error.error.status);
          return of(false)
        })
      )
  }

  onShowMenu(client: Client) {
    this.clients()!.forEach(p => {
      if (p !== client) {
        p.showMenu = false
      }
    });
    client.showMenu = !client.showMenu;
  }
}
