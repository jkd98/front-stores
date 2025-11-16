import { Routes } from "@angular/router";

export const clientRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('../product/layout/product-layout/product-layout.component').then(m => m.ProductLayoutComponent),
        children: [
            {
                path: 'clients',
                title: 'Clientes',
                loadComponent: () => import('./pages/client-page/client-page.component').then(m => m.ClientPageComponent)
            },
            {
                path: 'new-client',
                title: 'Agregar Cliente',
                loadComponent: () => import('./pages/client-form-page/client-form-page.component').then(m => m.ClientFormPageComponent)
            },

            {
                path: 'edit/:code',
                title: 'Editar Cliente',
                loadComponent: () => import('./pages/client-form-page/client-form-page.component').then(m => m.ClientFormPageComponent)
            },
            {
                path: '**',
                redirectTo: 'clients',
                pathMatch: 'full'
            }
        ]
    }
]

export default clientRoutes;