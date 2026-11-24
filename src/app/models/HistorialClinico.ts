import { CitaEstado } from './CitaEstado';
import { Diagnosticos } from './Diagnosticos';
import { Examenes } from './Examenes';
import { Recetas } from './Recetas';
import { Tratamientos } from './Tratamientos';

// Una consulta registrada en el detalle del historial
export class ConsultaHistorial {
    idDetalleHistorial: number = 0;
    fecha: string = '';
    medico: string = '';
    motivoConsulta: string = '';
}

// Todo el historial de un paciente en un solo objeto
export class HistorialClinico {
    idHistoriaClinica: number = 0;
    paciente: string = '';
    dni: string = '';
    fechaCreacion: string = '';
    citas: CitaEstado[] = [];
    examenes: Examenes[] = [];
    recetas: Recetas[] = [];
    // Solo vienen para el personal (ADMIN y MÉDICO); el paciente no los recibe
    consultas?: ConsultaHistorial[];
    diagnosticos?: Diagnosticos[];
    tratamientos?: Tratamientos[];
}
