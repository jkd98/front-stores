import { Routes } from "@angular/router";
import { AuthLayoutComponent } from "./layout/auth-layout/auth-layout.component";

export const authRoutes: Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'login',
                title: 'Iniciar Sesión',
                loadComponent: () => import('./pages/login-page/login-page.component')
            },
            {
                path: 'register',
                title: 'Crear Cuenta',
                loadComponent: () => import('./pages/register-page/register-page.component')
            },
            {
                path:'**',
                redirectTo:'login',
                pathMatch:'full'
            }
        ]
    }
];

export default authRoutes;