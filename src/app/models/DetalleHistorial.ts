export class DetalleHistorial {
    idDetalleHistorial: number = 0;
    idHistoriaClinica: number = 0;
    idMedico: number = 0;
    idExamen: number | null = null;
    idDiagnostico: number | null = null;
    idTratamiento: number | null = null;
    idReceta: number | null = null;
    motivoConsulta: string = '';
    cifradoDatos: string = '';
    fechaRegistro: Date = new Date();
}
