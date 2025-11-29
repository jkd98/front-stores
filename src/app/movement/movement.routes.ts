import { Routes } from "@angular/router";

export const movementRoutes:Routes = [
    {
        path:'',
        loadComponent: ()=> import('../product/layout/product-layout/product-layout.component').then(m=>m.ProductLayoutComponent),
        children:[
            {
                path:'new-entry/:code',
                title: 'Agregar Entrada',
                loadComponent: ()=> import('./pages/movements-page/movements-page.component').then(m=>m.MovementsPageComponent)
            },
            {
                path:'new-output/:code',
                title: 'Agregar Salida',
                loadComponent: ()=> import('./pages/movements-page/movements-page.component').then(m=>m.MovementsPageComponent)
            },
            {
                path:'**',
                redirectTo:'movements',
                pathMatch:'full'
            }
        ]
    }
]

export default movementRoutes;