import { Routes } from "@angular/router";
import { isAuthGuard } from "./guards/is-auth.guard";

export const productRoutes:Routes = [
    {
        path:'',
        loadComponent: ()=> import('./layout/product-layout/product-layout.component'),
        children:[
            {
                path:'products',
                title:'Productos',
                loadComponent: () => import('./pages/products-page/products-page.component')
            },
            {
                path:'new-product',
                title: 'Agregar Producto',
                loadComponent: ()=> import('./pages/product-form-page/product-form-page.component')
            },
            {
                path:'edit/:code',
                title: 'Editar Producto',
                loadComponent: ()=> import('./pages/product-form-page/product-form-page.component')
            },
            {
                path:'**',
                redirectTo:'products',
                pathMatch:'full'
            }
        ]
    }
]

export default productRoutes;