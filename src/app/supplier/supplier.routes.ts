import { Routes } from "@angular/router";

export const supplierRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('../product/layout/product-layout/product-layout.component').then(m => m.ProductLayoutComponent),
        children: [
            {
                path: 'suppliers',
                title: 'Proveedores',
                loadComponent: () => import('./pages/supplier-page/supplier-page.component').then(m => m.SupplierPageComponent)
            },
            {
                path: 'new-supplier',
                title: 'Agregar Proveedor',
                loadComponent: () => import('./pages/supplier-form-page/supplier-form-page.component').then(m => m.SupplierFormPageComponent)
            },
            {
                path: 'edit/:code',
                title: 'Editar Proveedor',
                loadComponent: () => import('./pages/supplier-form-page/supplier-form-page.component').then(m => m.SupplierFormPageComponent)

            },
            {
                path: '**',
                redirectTo: '/suppliers',
                pathMatch: 'full'
            }
        ]
    }
]

export default supplierRoutes;