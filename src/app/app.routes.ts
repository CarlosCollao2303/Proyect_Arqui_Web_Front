import { Routes } from '@angular/router';
import { Homecomponent } from './components/homecomponent/homecomponent';
import { Tratamientoscomponent } from './components/tratamientoscomponent/tratamientoscomponent';
import { Tlistarcomponent } from './components/tratamientoscomponent/tlistarcomponent/tlistarcomponent';
import { Tinsertarcomponent } from './components/tratamientoscomponent/tinsertarcomponent/tinsertarcomponent';
import { Diagnosticoscomponent } from './components/diagnosticoscomponent/diagnosticoscomponent';
import { Dlistarcomponent } from './components/diagnosticoscomponent/dlistarcomponent/dlistarcomponent';
import { Dinsertarcomponent } from './components/diagnosticoscomponent/dinsertarcomponent/dinsertarcomponent';
import { Examenescomponent } from './components/examenescomponent/examenescomponent';
import { Elistarcomponent } from './components/examenescomponent/elistarcomponent/elistarcomponent';
import { Einsertarcomponent } from './components/examenescomponent/einsertarcomponent/einsertarcomponent';
import { Recetascomponent } from './components/recetascomponent/recetascomponent';
import { Rlistarcomponent } from './components/recetascomponent/rlistarcomponent/rlistarcomponent';
import { Rinsertarcomponent } from './components/recetascomponent/rinsertarcomponent/rinsertarcomponent';

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
    {
        path: 'diagnosticos',
        component: Diagnosticoscomponent,
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', component: Dlistarcomponent },
            { path: 'insertar', component: Dinsertarcomponent },
        ],
    },
    {
        path: 'examenes',
        component: Examenescomponent,
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', component: Elistarcomponent },
            { path: 'insertar', component: Einsertarcomponent },
        ],
    },
    {
        path: 'recetas',
        component: Recetascomponent,
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', component: Rlistarcomponent },
            { path: 'insertar', component: Rinsertarcomponent },
        ],
    },
];
