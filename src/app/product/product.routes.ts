import { Routes } from "@angular/router";

export const productRoutes:Routes = [
    {
        path:'',
        loadComponent: ()=> import('./layout/product-layout/product-layout.component').then(m=>m.ProductLayoutComponent),
        children:[
            {
                path:'products',
                title:'Productos',
                loadComponent: () => import('./pages/products-page/products-page.component').then(m=>m.ProductsPageComponent)
            },
            {
                path:'new-product',
                title: 'Agregar Producto',
                loadComponent: ()=> import('./pages/product-form-page/product-form-page.component').then(m=>m.ProductFormPageComponent)
            },
            {
                path:'edit/:code',
                title: 'Editar Producto',
                loadComponent: ()=> import('./pages/product-form-page/product-form-page.component').then(m=>m.ProductFormPageComponent)
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