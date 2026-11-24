import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/homecomponent/homecomponent').then((module) => module.Homecomponent),
    },
    {
        path: 'login',
        loadComponent: () => import('./components/logincomponent/logincomponent').then((module) => module.Logincomponent),
    },
    {
        path: 'acceso-denegado',
        loadComponent: () => import('./components/accesodenegadocomponent/accesodenegadocomponent').then((module) => module.Accesodenegadocomponent),
    },
    {
        path: 'tratamientos',
        loadComponent: () => import('./components/tratamientoscomponent/tratamientoscomponent').then((module) => module.Tratamientoscomponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'MEDICO'] },
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
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'MEDICO'] },
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
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'MEDICO'] },
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
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'MEDICO'] },
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
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'MEDICO', 'PACIENTE'] },
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', loadComponent: () => import('./components/citascomponent/clistarcomponent/clistarcomponent').then((module) => module.Clistarcomponent), canActivate: [roleGuard], data: { roles: ['ADMIN', 'MEDICO'] } },
            { path: 'insertar', loadComponent: () => import('./components/citascomponent/cinsertarcomponent/cinsertarcomponent').then((module) => module.Cinsertarcomponent), canActivate: [roleGuard], data: { roles: ['ADMIN', 'MEDICO'] } },
            { path: 'actualizar/:id', loadComponent: () => import('./components/citascomponent/cinsertarcomponent/cinsertarcomponent').then((module) => module.Cinsertarcomponent), canActivate: [roleGuard], data: { roles: ['ADMIN', 'MEDICO'] } },
            { path: 'estado', loadComponent: () => import('./components/citascomponent/cestadocomponent/cestadocomponent').then((module) => module.Cestadocomponent) },
            { path: 'videollamada/:id', loadComponent: () => import('./components/citascomponent/cvideollamadacomponent/cvideollamadacomponent').then((module) => module.Cvideollamadacomponent) },
        ],
    },
    {
        path: 'historiasclinicas',
        loadComponent: () => import('./components/historiasclinicascomponent/historiasclinicascomponent').then((module) => module.Historiasclinicascomponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'MEDICO'] },
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
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'MEDICO', 'PACIENTE'] },
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', loadComponent: () => import('./components/especialidadescomponent/eslistarcomponent/eslistarcomponent').then((module) => module.Eslistarcomponent), canActivate: [roleGuard], data: { roles: ['ADMIN', 'MEDICO'] } },
            { path: 'insertar', loadComponent: () => import('./components/especialidadescomponent/esinsertarcomponent/esinsertarcomponent').then((module) => module.Esinsertarcomponent), canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
            { path: 'actualizar/:id', loadComponent: () => import('./components/especialidadescomponent/esinsertarcomponent/esinsertarcomponent').then((module) => module.Esinsertarcomponent), canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
            { path: 'medicos', loadComponent: () => import('./components/especialidadescomponent/esmedicoscomponent/esmedicoscomponent').then((module) => module.Esmedicoscomponent) },
        ],
    },
    {
        path: 'roles',
        loadComponent: () => import('./components/rolescomponent/rolescomponent').then((module) => module.Rolescomponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] },
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
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'MEDICO'] },
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', loadComponent: () => import('./components/usuarioscomponent/ulistarcomponent/ulistarcomponent').then((module) => module.Ulistarcomponent) },
            { path: 'insertar', loadComponent: () => import('./components/usuarioscomponent/uinsertarcomponent/uinsertarcomponent').then((module) => module.Uinsertarcomponent), canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
            { path: 'actualizar/:id', loadComponent: () => import('./components/usuarioscomponent/uinsertarcomponent/uinsertarcomponent').then((module) => module.Uinsertarcomponent), canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
            { path: 'asignar/:id', loadComponent: () => import('./components/usuarioscomponent/uasignarcomponent/uasignarcomponent').then((module) => module.Uasignarcomponent), canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
        ],
    },
    {
        path: 'reportes',
        loadComponent: () => import('./components/reportescomponent/reportescomponent').then((module) => module.Reportescomponent),
        children: [
            { path: '', redirectTo: 'examenes-pendientes', pathMatch: 'full' },
            { path: 'examenes-pendientes', loadComponent: () => import('./components/reportescomponent/repexamenespendientescomponent/repexamenespendientescomponent').then((module) => module.Repexamenespendientescomponent) },
            { path: 'examenes-por-paciente', loadComponent: () => import('./components/reportescomponent/repexamenespacientecomponent/repexamenespacientecomponent').then((module) => module.Repexamenespacientecomponent) },
            { path: 'citas-por-especialidad', loadComponent: () => import('./components/reportescomponent/repcitasespecialidadcomponent/repcitasespecialidadcomponent').then((module) => module.Repcitasespecialidadcomponent) },
            { path: 'espera-por-medico', loadComponent: () => import('./components/reportescomponent/repesperamedicocomponent/repesperamedicocomponent').then((module) => module.Repesperamedicocomponent) },
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
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'MEDICO'] },
        children: [
            { path: '', redirectTo: 'listar', pathMatch: 'full' },
            { path: 'listar', loadComponent: () => import('./components/detallehistorialcomponent/dhlistarcomponent/dhlistarcomponent').then((module) => module.Dhlistarcomponent) },
            { path: 'insertar', loadComponent: () => import('./components/detallehistorialcomponent/dhinsertarcomponent/dhinsertarcomponent').then((module) => module.Dhinsertarcomponent) },
            { path: 'actualizar/:id', loadComponent: () => import('./components/detallehistorialcomponent/dhinsertarcomponent/dhinsertarcomponent').then((module) => module.Dhinsertarcomponent) },
        ],
    },
];
