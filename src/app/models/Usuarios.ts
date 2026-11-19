export class Usuarios {
    idUsuario: number = 0;
    idRol: number = 0;
    // null = sin especialidad (solo los MEDICO tienen una)
    idEspecialidad: number | null = null;
    nombres: string = '';
    apellidos: string = '';
    dni: string = '';
    telefono: string = '';
    correo: string = '';
    // Solo se envía al registrar o actualizar; el back nunca la devuelve
    contrasenaHash?: string;
    colegiatura: string = '';
    regionUbicacion: string = '';
    estado: boolean = false;
}
