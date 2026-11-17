export class Examenes {
    idExamen: number=0;
    tipoExamen: string='';
    descripcion: string='';
    fechaSolicitud: Date=new Date();
    // null = examen pendiente (aún sin resultado)
    fechaResultado: Date | null = null;
}