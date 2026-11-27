// Fila del reporte de médicos por especialidad (GET /api/especialidades/reporte-medicos)
// idEspecialidad es null en la fila "Sin especialidad" (médicos que aún no tienen una)
export class MedicosEspecialidad {
    idEspecialidad: number | null = null;
    especialidad: string = '';
    activos: number = 0;
    inactivos: number = 0;
    total: number = 0;
}
