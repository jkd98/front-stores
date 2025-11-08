import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


type TAuthStatus = 'checking' | 'authenticated' | 'not-authenticated' | '2FA' | 'invalid-code' | 'register' | 'forgot-pass' | 'new-pass';

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

type TNwUser = {
  name: string;
  lastN: string;
  pass: string;
  email: string;
  telf: string;
}

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #authStatus = signal<TAuthStatus>('checking');
  #user = signal<null | TAuthSuccessData['user']>(null);
  #token = signal<string | null>(null);
  #response = signal<TAuthRespnse | null>(null);
  #showMessage = signal<boolean>(false);

  #http = inject(HttpClient);
  #router = inject(Router);
  #timeoutId: ReturnType<typeof setTimeout> | null = null;

  authStatus = computed<TAuthStatus>(() => {
    return this.#authStatus();
  })
  user = computed(() => this.#user());
  token = computed<string | null>(() => this.#token());
  response = computed<TAuthRespnse | null>(() => this.#response());
  showMessage = computed<boolean>(() => this.#showMessage());

  constructor() {
    this.#token.set(window.sessionStorage.getItem('_jwt'));
    this.#user.set(JSON.parse(window.sessionStorage.getItem('_user') || 'null'));
  }
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
          const { data } = res;
          this.#authStatus.set('2FA');
          this.#user.set({ email, pass })
          this.showResponseByToast(res)
        }),
        map(() => true),
        catchError((error) => {
          console.log(error.error);
          this.#authStatus.set('not-authenticated');
          this.showResponseByToast(error.error);
          return of(false)
        })
      );
  }

  verify2FA(code: string): Observable<boolean> {
    const formData = { code, userId: this.#response()?.data?.userId };
    return this.#http.post<TAuthRespnse>(`${baseUrl}/auth/verify-2fa`, formData)
      .pipe(
        tap((res) => {
          const { data, msg } = res;
          console.log(res);
          this.#authStatus.set('authenticated');
          this.#token.set(data?.tkn!);
          this.#user.set(data?.user);
          window.sessionStorage.setItem('_jwt', this.#token()!);
          window.sessionStorage.setItem('_user', JSON.stringify(this.#user()!));
          this.showResponseByToast(res);
        }),
        map(() => true),
        catchError((error) => {
          console.log(error.error)
          this.#authStatus.set('invalid-code');
          this.showResponseByToast(error.error);
          if (error.error.msg.includes('Demasiados intentos')) {
            this.#router.navigate(['/auth/login'])
          }
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
          this.#authStatus.set('2FA');
          this.showResponseByToast(res);
        }),
        map(() => true),
        catchError((error) => {
          const { msg } = error.error;
          console.log(error.error)
          this.#authStatus.set('not-authenticated');
          this.showResponseByToast(error.error);
          if (error.error.msg.includes('Demasiados intentos')) {
            this.#router.navigate(['/auth/login'])
          }
          return of(false)
        })
      );
  }

  registerUser(nwUser: TNwUser): Observable<boolean> {
    return this.#http.post<TAuthRespnse>(`${baseUrl}/auth/registro`, nwUser)
      .pipe(
        tap((res) => {
          const { msg } = res;
          console.log(res);
          this.showResponseByToast(res);

        }),
        map(() => true),
        catchError((error) => {
          const { msg } = error.error;
          console.log(error.error);
          this.showResponseByToast(error.error);
          return of(false)
        })
      );
  }

  confirmAccount(token: string) {
    return this.#http.post<TAuthRespnse>(`${baseUrl}/auth/confirmar-cuenta`, { token })
      .pipe(
        tap((res) => {
          const { msg } = res;
          this.#authStatus.set('checking');
          console.log(res);
          this.showResponseByToast(res);
        }),
        map(() => true),
        catchError((error) => {
          const { msg } = error.error;
          console.log(error.error);
          this.#authStatus.set('invalid-code');
          this.showResponseByToast(error.error);
          return of(false)
        })
      );
  }

  generateNewConfirmCode(email: string) {
    return this.#http.post<TAuthRespnse>(`${baseUrl}/auth/new-code-confirm`, { email })
      .pipe(
        tap((res) => {
          const { msg } = res;
          this.#authStatus.set('checking');
          this.showResponseByToast(res);
          console.log(res);
        }),
        map(() => true),
        catchError((error) => {
          const { msg } = error.error;
          console.log(error.error);
          this.showResponseByToast(error.error);
          return of(false)
        })
      );
  }

  requestNewPass(email: string) {
    return this.#http.post<TAuthRespnse>(`${baseUrl}/auth/tkn-reset`, { email })
      .pipe(
        tap((res) => {
          const { msg } = res;
          console.log(res);
          this.showResponseByToast(res);
        }),
        map(() => true),
        catchError((error) => {
          const { msg } = error.error;
          console.log(error.error);
          this.showResponseByToast(error.error);
          return of(false)
        })
      );
  }

  newPass(pass: string, token: string) {
    return this.#http.post<TAuthRespnse>(`${baseUrl}/auth/new-pass`, { pass, token })
      .pipe(
        tap((res) => {
          const { msg } = res;
          this.showResponseByToast(res);
          console.log(res);
        }),
        map(() => true),
        catchError((error) => {
          const { msg } = error.error;
          console.log(error.error);
          this.showResponseByToast(error.error);
          return of(false)
        })
      );
  }

  logOut() {
    return this.#http.post<TAuthRespnse>(`${baseUrl}/auth/logout`, { email: this.#user()?.email })
      .pipe(
        tap((res) => {
          console.log(res);
          window.sessionStorage.removeItem('_jwt');
          window.sessionStorage.removeItem('_user');
          this.#user.set(null);
          this.#token.set(null);
          this.showResponseByToast(res);
        }),
        map(() => true),
        catchError((error) => {
          console.log(error.error);
          this.showResponseByToast(error.error);
          return of(false)
        })
      );
  }

  // sendBeacon al detectar el cierre de pestaña
  sendLogoutBeacon(): void {
    //Toma estos datos, envíalos, y hazlo tú mismo sin esperarme. No me importa la respuesta.

    // 1. URL completa de endpoint de logout
    const logoutUrl = `${baseUrl}/auth/logout`;

    // 2. Cuerpo de la petición (JSON)
    const data = new Blob([JSON.stringify({ email: this.#user()?.email })], {
      type: 'application/json; charset=UTF-8'
    });

    // 3. sendBeacon
    /*
      Este metodo senBeacon le quita el trabajo a código JavaScript (que está a punto de morir) 
      y se lo delega al navegador, el cual tiene un mecanismo especial 
      para completar este tipo de "mensajes de emergencia".
    */
    // sendBeacon devuelve 'true' si el navegador pudo encolar la petición.
    const sent = window.navigator.sendBeacon(logoutUrl, data);

    if (sent) {
      console.log('Logout beacon encolado exitosamente.');
    } else {
      console.error('Fallo al encolar el logout beacon.');
    }
  }


  showResponseByToast({ msg, data, status }: any) {
    if (this.#timeoutId) {
      clearTimeout(this.#timeoutId);
      this.#timeoutId = null;
    }
    this.#response.set({ msg, data, status });
    this.#showMessage.set(true);
    this.#timeoutId = setTimeout(() => {
      this.#showMessage.set(false);
    }, 4000);
  }

}
