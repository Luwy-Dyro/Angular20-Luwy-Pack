import { Routes } from '@angular/router';
import { NoAuthentGuard } from '@auth/guards/no-authent.guard';

export const routes: Routes = [

    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes),
        //todo Guards
        canMatch:[
            // NoAuthentGuard,
            // ()=>{
            //     console.log('aquiii');
            //     return true
            // }
            NoAuthentGuard
        ]
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin-dashboard/admin-dash.routes')
    },
    {
        path: '',
        loadChildren: () => import('./store-front/store-front.routes')

    },
 
        
    
];


