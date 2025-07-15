import { Routes } from '@angular/router';
import { AdminDashLayoutComponent } from './layouts/admin-dash-layout/admin-dash-layout.component';
import { ProductAdminPageComponent } from './pages/product-admin-page/product-admin-page.component';
import { ProductsAdminPageComponent } from './pages/produts-admin-page/products-admin-page.component';
import { isAdminGuard } from '@auth/guards/is-admin.guard';

export const adminRoutes: Routes = [

    {
        path: '',
        component: AdminDashLayoutComponent,
        canMatch: [isAdminGuard],
        children:[
            {
                path: 'products',
                component: ProductsAdminPageComponent
            },
            {
                path: 'products/:id',
                component: ProductAdminPageComponent
            },
            {
                path:'**',
                redirectTo: 'products'
            }
        ]

    }
]

export default adminRoutes