import { Routes } from "@angular/router";

export const supplierRoutes:Routes = [
    {
        path:'',
        //loadComponent: ()=> import('./layout/product-layout/product-layout.component').then(m=>m.ProductLayoutComponent),
        children:[
            {
                path:'suppliers',
                title:'Proveedores',
                //loadComponent: () => import('./pages/products-page/products-page.component').then(m=>m.ProductsPageComponent)
            },
            {
                path:'new-supplier',
                title: 'Agregar Proveedor',
                //loadComponent: ()=> import('./pages/product-form-page/product-form-page.component').then(m=>m.ProductFormPageComponent)
            },
            {
                path:'edit/:code',
                title: 'Editar Proveedor',
                //loadComponent: ()=> import('./pages/product-form-page/product-form-page.component').then(m=>m.ProductFormPageComponent)
            },
            {
                path:'**',
                redirectTo:'suppliers',
                pathMatch:'full'
            }
        ]
    }
]

export default supplierRoutes;