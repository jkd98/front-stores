import { Routes } from '@angular/router';
import { isAuthGuard } from './product/guards/is-auth.guard';
import { isLoggedGuard } from './product/guards/is-logged.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes'),
        canActivate: [isLoggedGuard]
    },
    {
        path: 'product',
        loadChildren: () => import('./product/product.routes'),
        canActivate: [isAuthGuard],
    },
    {
        path: 'supplier',
        loadChildren: () => import('./supplier/supplier.routes'),
        canActivate: [isAuthGuard],
    },
    {
        path: 'client',
        loadChildren: () => import('./client/client.routes'),
        canActivate: [isAuthGuard],
    },
    {
        path: 'movement',
        loadChildren: () => import('./movement/movement.routes'),
        canActivate: [isAuthGuard],
    },
    {
        path: '**',
        redirectTo: '/product',
        pathMatch: 'full'
    }
];
