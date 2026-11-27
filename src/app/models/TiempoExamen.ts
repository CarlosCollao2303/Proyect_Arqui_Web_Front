// Fila del reporte de tiempo de entrega por tipo de examen (GET /api/examenes/tiempo-entrega)
export class TiempoExamen {
    tipoExamen: string = '';
    solicitados: number = 0;
    conResultado: number = 0;
    pendientes: number = 0;
    // Días con un decimal; null si ningún examen de ese tipo tiene resultado todavía
    diasPromedio: number | null = null;
    diasMaximo: number | null = null;
}
