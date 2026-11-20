// Fila del reporte de citas por especialidad (GET /api/citas/estado-por-especialidad)
export class CitasEspecialidad {
    especialidad: string = '';
    atendidas: number = 0;
    pendientes: number = 0;
    canceladas: number = 0;
    total: number = 0;
}
