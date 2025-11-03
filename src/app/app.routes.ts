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
        path: '**',
        redirectTo: '/product',
        pathMatch: 'full'
    }
];
