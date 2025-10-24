import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';


type TAuthStatus = 'checking' | 'authenticated' | 'not-authenticated' | '2FA' | 'invalid-code' | 'register';
type TAuthSuccessData = {
  userId?: number;
  user?: {
    name?: string;
    email: string;
    pass?: string;
    role?: string;
  }
  tkn?: string
}
type TAuthRespnse = {
  data: TAuthSuccessData | null;
  msg: string;
  status: string;
}

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #authStatus = signal<TAuthStatus>('checking');
  #user = signal<null | TAuthSuccessData['user']>(null);
  #userId = signal<number | null>(null);
  #token = signal<string | null>(null);
  #responseMsg = signal<string | null>(null);

  #http = inject(HttpClient);

  authStatus = computed<TAuthStatus>(() => {
    /* if (this.#authStatus() === 'checking') return 'checking';
    if (this.#user()) return 'authenticated';
    if (this.#authStatus() === '2FA') return '2FA';
    return 'not-authenticated'; */
    return this.#authStatus();
  })

  user = computed(() => this.#user());
  token = computed<string | null>(() => this.#token());
  responseMsg = computed<string | null>(() => this.#responseMsg());

  /**
   * Función para iniciar sesión, comenzando con el 
   * proceso de autenticación en dos pasos
   * @param email correo del usuario
   * @param pass contraseña del usuario
   * @returns boolean
   */
  login(email: string, pass: string): Observable<boolean> {
    return this.#http.post<TAuthRespnse>(`${baseUrl}/auth/login`, { email, pass })
      .pipe(
        tap((res) => {
          const { data, msg } = res;
          console.log(res);
          this.#userId.set(data!.userId!);
          this.#responseMsg.set(msg);
          this.#authStatus.set('2FA');
          this.#user.set({ email, pass })
        }),
        map(() => true),
        catchError((error) => {
          const { msg } = error.error;
          console.log(error.error)
          this.#responseMsg.set(msg);
          this.#user.set(null);
          this.#token.set(null);
          this.#authStatus.set('not-authenticated');
          return of(false)
        })
      );
  }

  verify2FA(code: string): Observable<boolean> {
    const formData = { code, userId: this.#userId() };
    return this.#http.post<TAuthRespnse>(`${baseUrl}/auth/verify-2fa`, formData)
      .pipe(
        tap((res) => {
          const { data, msg } = res;
          console.log(res);
          this.#userId.set(null);
          this.#responseMsg.set(msg);
          this.#authStatus.set('authenticated');
          this.#token.set(data?.tkn || null)
        }),
        map(() => true),
        catchError((error) => {
          console.log(error.error)
          const { msg } = error.error;
          this.#responseMsg.set(msg);
          this.#token.set(null);
          this.#authStatus.set('invalid-code');
          return of(false)
        })
      );
  }

  generateNewCode2FA(): Observable<boolean> {
    return this.#http.post<TAuthRespnse>(`${baseUrl}/auth/login`, { email: this.#user()?.email, pass: this.#user()?.pass })
      .pipe(
        tap((res) => {
          const { data, msg } = res;
          console.log(res);
          this.#userId.set(data?.userId || null);
          this.#responseMsg.set(msg);
          this.#authStatus.set('2FA');
        }),
        map(() => true),
        catchError((error) => {
          const { msg } = error.error;
          console.log(error.error)
          this.#responseMsg.set(msg);
          this.#user.set(null);
          this.#token.set(null);
          this.#authStatus.set('not-authenticated');
          return of(false)
        })
      );
  }

  setStatusRegister() {
    this.#authStatus.set('register');
  }

  setStatusChecking() {
    this.#authStatus.set('checking');
  }
}
