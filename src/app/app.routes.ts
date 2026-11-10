import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/homecomponent/homecomponent').then((module) => module.Homecomponent),
    },
    {
        path: 'tratamientos',
        loadComponent: () => import('./components/tratamientoscomponent/tratamientoscomponent').then((module) => module.Tratamientoscomponent),
        children: [
            {
                path: '',
                redirectTo: 'listar',
                pathMatch: 'full'
            },
            {
                path: 'listar',
                loadComponent: () => import('./components/tratamientoscomponent/tlistarcomponent/tlistarcomponent').then((module) => module.Tlistarcomponent),
            },
            {
                path: 'insertar',
                loadComponent: () => import('./components/tratamientoscomponent/tinsertarcomponent/tinsertarcomponent').then((module) => module.Tinsertarcomponent),
            },
            {
                path: 'actualizar/:id',
                loadComponent: () => import('./components/tratamientoscomponent/tinsertarcomponent/tinsertarcomponent').then((module) => module.Tinsertarcomponent),
            }
        ],
    },
    {
        path: 'diagnosticos',
        loadComponent: () => import('./components/diagnosticoscomponent/diagnosticoscomponent').then((module) => module.Diagnosticoscomponent),
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', loadComponent: () => import('./components/diagnosticoscomponent/dlistarcomponent/dlistarcomponent').then((module) => module.Dlistarcomponent) },
            { path: 'insertar', loadComponent: () => import('./components/diagnosticoscomponent/dinsertarcomponent/dinsertarcomponent').then((module) => module.Dinsertarcomponent) },
            { path: 'detalle/:id', loadComponent: () => import('./components/diagnosticoscomponent/ddetallecomponent/ddetallecomponent').then((module) => module.Ddetallecomponent) },
            { path: 'actualizar/:id', loadComponent: () => import('./components/diagnosticoscomponent/dinsertarcomponent/dinsertarcomponent').then((module) => module.Dinsertarcomponent) },
        ],
    },
    {
        path: 'examenes',
        loadComponent: () => import('./components/examenescomponent/examenescomponent').then((module) => module.Examenescomponent),
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', loadComponent: () => import('./components/examenescomponent/elistarcomponent/elistarcomponent').then((module) => module.Elistarcomponent) },
            { path: 'insertar', loadComponent: () => import('./components/examenescomponent/einsertarcomponent/einsertarcomponent').then((module) => module.Einsertarcomponent) },
            { path: 'actualizar/:id', loadComponent: () => import('./components/examenescomponent/einsertarcomponent/einsertarcomponent').then((module) => module.Einsertarcomponent) },
        ],
    },
    {
        path: 'recetas',
        loadComponent: () => import('./components/recetascomponent/recetascomponent').then((module) => module.Recetascomponent),
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', loadComponent: () => import('./components/recetascomponent/rlistarcomponent/rlistarcomponent').then((module) => module.Rlistarcomponent) },
            { path: 'insertar', loadComponent: () => import('./components/recetascomponent/rinsertarcomponent/rinsertarcomponent').then((module) => module.Rinsertarcomponent) },
            { path: 'actualizar/:id', loadComponent: () => import('./components/recetascomponent/rinsertarcomponent/rinsertarcomponent').then((module) => module.Rinsertarcomponent) },
        ],
    },
    {
        path: 'citas',
        loadComponent: () => import('./components/citascomponent/citascomponent').then((module) => module.Citascomponent),
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', loadComponent: () => import('./components/citascomponent/clistarcomponent/clistarcomponent').then((module) => module.Clistarcomponent) },
            { path: 'insertar', loadComponent: () => import('./components/citascomponent/cinsertarcomponent/cinsertarcomponent').then((module) => module.Cinsertarcomponent) },
        ],
    },
    {
        path: 'historiasclinicas',
        loadComponent: () => import('./components/historiasclinicascomponent/historiasclinicascomponent').then((module) => module.Historiasclinicascomponent),
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', loadComponent: () => import('./components/historiasclinicascomponent/hlistarcomponent/hlistarcomponent').then((module) => module.Hlistarcomponent) },
            { path: 'insertar', loadComponent: () => import('./components/historiasclinicascomponent/hinsertarcomponent/hinsertarcomponent').then((module) => module.Hinsertarcomponent) },
        ],
    },
];
