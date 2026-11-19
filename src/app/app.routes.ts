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
            { path: 'detalle/:id', loadComponent: () => import('./components/recetascomponent/rdetallecomponent/rdetallecomponent').then((module) => module.Rdetallecomponent) },
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
            { path: 'actualizar/:id', loadComponent: () => import('./components/citascomponent/cinsertarcomponent/cinsertarcomponent').then((module) => module.Cinsertarcomponent) },
            { path: 'estado', loadComponent: () => import('./components/citascomponent/cestadocomponent/cestadocomponent').then((module) => module.Cestadocomponent) },
            { path: 'videollamada/:id', loadComponent: () => import('./components/citascomponent/cvideollamadacomponent/cvideollamadacomponent').then((module) => module.Cvideollamadacomponent) },
        ],
    },
    {
        path: 'historiasclinicas',
        loadComponent: () => import('./components/historiasclinicascomponent/historiasclinicascomponent').then((module) => module.Historiasclinicascomponent),
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', loadComponent: () => import('./components/historiasclinicascomponent/hlistarcomponent/hlistarcomponent').then((module) => module.Hlistarcomponent) },
            { path: 'insertar', loadComponent: () => import('./components/historiasclinicascomponent/hinsertarcomponent/hinsertarcomponent').then((module) => module.Hinsertarcomponent) },
            { path: 'actualizar/:id', loadComponent: () => import('./components/historiasclinicascomponent/hinsertarcomponent/hinsertarcomponent').then((module) => module.Hinsertarcomponent) },
        ],
    },
    {
        path: 'especialidades',
        loadComponent: () => import('./components/especialidadescomponent/especialidadescomponent').then((module) => module.Especialidadescomponent),
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', loadComponent: () => import('./components/especialidadescomponent/eslistarcomponent/eslistarcomponent').then((module) => module.Eslistarcomponent) },
            { path: 'insertar', loadComponent: () => import('./components/especialidadescomponent/esinsertarcomponent/esinsertarcomponent').then((module) => module.Esinsertarcomponent) },
            { path: 'actualizar/:id', loadComponent: () => import('./components/especialidadescomponent/esinsertarcomponent/esinsertarcomponent').then((module) => module.Esinsertarcomponent) },
            { path: 'medicos', loadComponent: () => import('./components/especialidadescomponent/esmedicoscomponent/esmedicoscomponent').then((module) => module.Esmedicoscomponent) },
        ],
    },
    {
        path: 'roles',
        loadComponent: () => import('./components/rolescomponent/rolescomponent').then((module) => module.Rolescomponent),
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', loadComponent: () => import('./components/rolescomponent/rolistarcomponent/rolistarcomponent').then((module) => module.Rolistarcomponent) },
            { path: 'insertar', loadComponent: () => import('./components/rolescomponent/roinsertarcomponent/roinsertarcomponent').then((module) => module.Roinsertarcomponent) },
            { path: 'actualizar/:id', loadComponent: () => import('./components/rolescomponent/roinsertarcomponent/roinsertarcomponent').then((module) => module.Roinsertarcomponent) },
        ],
    },
    {
        path: 'usuarios',
        loadComponent: () => import('./components/usuarioscomponent/usuarioscomponent').then((module) => module.Usuarioscomponent),
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', loadComponent: () => import('./components/usuarioscomponent/ulistarcomponent/ulistarcomponent').then((module) => module.Ulistarcomponent) },
            { path: 'insertar', loadComponent: () => import('./components/usuarioscomponent/uinsertarcomponent/uinsertarcomponent').then((module) => module.Uinsertarcomponent) },
            { path: 'actualizar/:id', loadComponent: () => import('./components/usuarioscomponent/uinsertarcomponent/uinsertarcomponent').then((module) => module.Uinsertarcomponent) },
            { path: 'asignar/:id', loadComponent: () => import('./components/usuarioscomponent/uasignarcomponent/uasignarcomponent').then((module) => module.Uasignarcomponent) },
        ],
    },
    {
        path: 'reportes',
        loadComponent: () => import('./components/reportescomponent/reportescomponent').then((module) => module.Reportescomponent),
        children: [
            { path: '', redirectTo: 'examenes-pendientes', pathMatch: 'full' },
            { path: 'examenes-pendientes', loadComponent: () => import('./components/reportescomponent/repexamenespendientescomponent/repexamenespendientescomponent').then((module) => module.Repexamenespendientescomponent) },
            { path: 'examenes-por-paciente', loadComponent: () => import('./components/reportescomponent/repexamenespacientecomponent/repexamenespacientecomponent').then((module) => module.Repexamenespacientecomponent) },
        ],
    },
    {
        path: 'notificaciones',
        loadComponent: () => import('./components/notificacionescomponent/notificacionescomponent').then((module) => module.Notificacionescomponent),
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', loadComponent: () => import('./components/notificacionescomponent/nlistarcomponent/nlistarcomponent').then((module) => module.Nlistarcomponent) },
            { path: 'enviar', loadComponent: () => import('./components/notificacionescomponent/nenviarcomponent/nenviarcomponent').then((module) => module.Nenviarcomponent) },
        ],
    },
    {
        path: 'detallehistorial',
        loadComponent: () => import('./components/detallehistorialcomponent/detallehistorialcomponent').then((module) => module.Detallehistorialcomponent),
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', loadComponent: () => import('./components/detallehistorialcomponent/dhlistarcomponent/dhlistarcomponent').then((module) => module.Dhlistarcomponent) },
            { path: 'insertar', loadComponent: () => import('./components/detallehistorialcomponent/dhinsertarcomponent/dhinsertarcomponent').then((module) => module.Dhinsertarcomponent) },
            { path: 'actualizar/:id', loadComponent: () => import('./components/detallehistorialcomponent/dhinsertarcomponent/dhinsertarcomponent').then((module) => module.Dhinsertarcomponent) },
        ],
    },
];
