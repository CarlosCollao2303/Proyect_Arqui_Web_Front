export class LoginResponseDTO {
    token: string = '';
    // Correo del usuario (subject del JWT)
    username: string = '';
    // ADMIN, MEDICO o PACIENTE
    roles: string[] = [];
}
