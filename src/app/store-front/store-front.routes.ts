import { Routes } from '@angular/router';
import { StoreFrontLayoutComponent } from './layouts/store-front-layout/store-front-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { GenderPageComponent } from './pages/gender-page/gender-page.component';
import { ProductoPageComponent } from './pages/producto-page/producto-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

export const storeFrontRoutes: Routes = [

    {
        path: '',
        component: StoreFrontLayoutComponent,
        children: [
            {
                path: '',
                component: HomePageComponent
            },
            {
                path: 'gender/:gender',
                component: GenderPageComponent
            },
            {
                path: 'product/:idSlug',
                component: ProductoPageComponent
            },
            {
                path: '**',
                component: NotFoundPageComponent
            },
        ]
    },
    {
        path: '**',        
        redirectTo: ''
    }


]

export default storeFrontRoutes