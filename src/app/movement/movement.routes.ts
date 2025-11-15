import { Routes } from "@angular/router";

export const movementRoutes:Routes = [
    {
        path:'',
        //loadComponent: ()=> import('./layout/product-layout/product-layout.component').then(m=>m.ProductLayoutComponent),
        children:[
            {
                path:'movements',
                title:'Movimientos',
                //loadComponent: () => import('./pages/products-page/products-page.component').then(m=>m.ProductsPageComponent)
            },
            {
                path:'new-entry',
                title: 'Agregar Entrada',
                //loadComponent: ()=> import('./pages/product-form-page/product-form-page.component').then(m=>m.ProductFormPageComponent)
            },
            {
                path:'new-output',
                title: 'Agregar Salida',
                //loadComponent: ()=> import('./pages/product-form-page/product-form-page.component').then(m=>m.ProductFormPageComponent)
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