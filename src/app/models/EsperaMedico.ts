// Fila del reporte de tiempo de espera por médico (GET /api/citas/espera-por-medico)
export class EsperaMedico {
    // Nombre completo del médico
    medico: string = '';
    especialidad: string = '';
    citasAtendidas: number = 0;
    // Minutos, con un decimal
    esperaPromedio: number = 0;
    esperaMaxima: number = 0;
}
