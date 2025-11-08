import { Routes } from "@angular/router";
import { isTwoFactorGuard } from "./guards/is-two-factor.guard";

export const authRoutes: Routes = [
    {
        path: '',
        loadComponent: ()=>import('./layout/auth-layout/auth-layout.component').then(m=>m.AuthLayoutComponent),
        children: [
            {
                path: 'login',
                title: 'Iniciar Sesión',
                loadComponent: () => import('./pages/login-page/login-page.component').then(m=>m.LoginPageComponent)
            },
            {
                path: 'register',
                title: 'Crear Cuenta',
                loadComponent: () => import('./pages/register-page/register-page.component').then(m=>m.RegisterPageComponent)
            },
            {
                path: 'confirm-account',
                title: 'Confirmar Cuenta',
                loadComponent: () => import('./pages/confirm-account-page/confirm-account-page.component').then(m=>m.ConfirmAccountPageComponent)
            },
            {
                path: '2fa',
                title: 'Autenticación Doble Factor',
                loadComponent: () => import('./pages/page-two-fa/page-two-fa.component').then(m=>m.PageTwoFaComponent),
                canActivate:[isTwoFactorGuard]
            },
            {
                path: 'forgot-pass',
                title: 'Solicitar Nueva Contraseña',
                loadComponent: () => import('./pages/request-new-pass-page/request-new-pass-page.component').then(m=>m.RequestNewPassPageComponent)
            },
            {
                path: 'new-pass',
                title: 'Nueva Contraseña',
                loadComponent: () => import('./pages/new-pass-page/new-pass-page.component').then(m=>m.NewPassPageComponent)
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