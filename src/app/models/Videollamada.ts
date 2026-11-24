export class Videollamada {
    idCita: number = 0;
    dominio: string = '';
    sala: string = '';
    enlace: string = '';
    paciente: string = '';
    medico: string = '';
    fecha: Date = new Date();
    estado: string = '';
    // Código QR del enlace (imagen PNG en base64) para abrirlo con el celular
    qr: string | null = null;
}
