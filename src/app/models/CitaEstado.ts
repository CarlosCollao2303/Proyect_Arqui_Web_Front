export class CitaEstado {
    idCita: number = 0;
    // LocalDate del back: "2026-10-02"
    fecha: string = '';
    // LocalTime del back: "10:30:00"
    hora: string = '';
    estado: string = '';
    paciente: string = '';
    medico: string = '';
    especialidad: string | null = null;
}
