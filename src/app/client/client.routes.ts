import { Routes } from "@angular/router";

export const clientRoutes:Routes = [
    {
        path:'',
        //loadComponent: ()=> import('./layout/product-layout/product-layout.component').then(m=>m.ProductLayoutComponent),
        children:[
            {
                path:'clients',
                title:'Clientes',
                //loadComponent: () => import('./pages/products-page/products-page.component').then(m=>m.ProductsPageComponent)
            },
            {
                path:'new-client',
                title: 'Agregar Cliente',
                //loadComponent: ()=> import('./pages/product-form-page/product-form-page.component').then(m=>m.ProductFormPageComponent)
            },
            {
                path:'edit/:code',
                title: 'Editar Cliente',
                //loadComponent: ()=> import('./pages/product-form-page/product-form-page.component').then(m=>m.ProductFormPageComponent)
            },
            {
                path:'**',
                redirectTo:'clients',
                pathMatch:'full'
            }
        ]
    }
]

export default clientRoutes;