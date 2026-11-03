import { Routes } from '@angular/router';
import { Homecomponent } from './components/homecomponent/homecomponent';
import { Tratamientoscomponent } from './components/tratamientoscomponent/tratamientoscomponent';
import { Tlistarcomponent } from './components/tratamientoscomponent/tlistarcomponent/tlistarcomponent';
import { Tinsertarcomponent } from './components/tratamientoscomponent/tinsertarcomponent/tinsertarcomponent';

export const routes: Routes = [
    {
        path: '',
        component:Homecomponent,
    },
    {
        path: 'tratamientos',
        component: Tratamientoscomponent,
        children:[
            {
                path: '',
                redirectTo: 'listar',
                pathMatch: 'full'
            },
            {
                path: 'listar',
                component: Tlistarcomponent,
            },
            {
                path: 'insertar',
                component: Tinsertarcomponent,
            }
        ],
    },
];
