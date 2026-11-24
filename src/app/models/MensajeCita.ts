// Mensaje pre armado de una cita, tal como llega al correo del paciente
export class MensajeCita {
    idCita: number = 0;
    tipo: string = '';
    asunto: string = '';
    destinatario: string = '';
    correo: string = '';
    mensaje: string = '';
}
