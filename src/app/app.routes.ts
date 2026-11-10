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
import { Citascomponent } from './components/citascomponent/citascomponent';
import { Clistarcomponent } from './components/citascomponent/clistarcomponent/clistarcomponent';
import { Cinsertarcomponent } from './components/citascomponent/cinsertarcomponent/cinsertarcomponent';
import { Historiasclinicascomponent } from './components/historiasclinicascomponent/historiasclinicascomponent';
import { Hlistarcomponent } from './components/historiasclinicascomponent/hlistarcomponent/hlistarcomponent';
import { Hinsertarcomponent } from './components/historiasclinicascomponent/hinsertarcomponent/hinsertarcomponent';

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
            },
            {
                path: 'actualizar/:id',
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
            { path: 'actualizar/:id', component: Dinsertarcomponent },
        ],
    },
    {
        path: 'examenes',
        component: Examenescomponent,
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', component: Elistarcomponent },
            { path: 'insertar', component: Einsertarcomponent },
            { path: 'actualizar/:id', component: Einsertarcomponent },
        ],
    },
    {
        path: 'recetas',
        component: Recetascomponent,
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', component: Rlistarcomponent },
            { path: 'insertar', component: Rinsertarcomponent },
            { path: 'actualizar/:id', component: Rinsertarcomponent },
        ],
    },
    {
        path: 'citas',
        component: Citascomponent,
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', component: Clistarcomponent },
            { path: 'insertar', component: Cinsertarcomponent },
        ],
    },
    {
        path: 'historiasclinicas',
        component: Historiasclinicascomponent,
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', component: Hlistarcomponent },
            { path: 'insertar', component: Hinsertarcomponent },
        ],
    },
];
