import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideCircleX, LucideInfo, LucideSave } from '@lucide/angular';
import { Usuarios } from '../../../models/Usuarios';
import { Usuariosservice } from '../../../services/usuariosservice';

@Component({
  selector: 'app-uinsertarcomponent',
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule, RouterLink, LucideCircleX, LucideInfo, LucideSave],
  templateUrl: './uinsertarcomponent.html',
  styleUrl: './uinsertarcomponent.css',
})
export class Uinsertarcomponent implements OnInit {
  formUsuarios: FormGroup;
  mensaje = '';
  isEditing = false;
  // Datos que este formulario no edita (rol, especialidad y estado); se reenvían tal cual
  private usuarioCargado: Usuarios | null = null;

  constructor(
    private service: Usuariosservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.formUsuarios = this.fb.nonNullable.group({
      idUsuario: [0],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasenaHash: ['', Validators.required],
      colegiatura: [''],
      regionUbicacion: [''],
    });
  }

  ngOnInit(): void {
    // Si la ruta trae un id, estamos en modo actualizar
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isInteger(id) && id > 0) {
      this.isEditing = true;
      // Al editar la contraseña es opcional: vacía conserva la actual
      this.formUsuarios.controls['contrasenaHash'].clearValidators();
      this.formUsuarios.controls['contrasenaHash'].updateValueAndValidity();
      this.service.getUsuarioById(id).subscribe({
        next: (usuario) => {
          this.usuarioCargado = usuario;
          this.formUsuarios.patchValue({
            idUsuario: usuario.idUsuario,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            dni: usuario.dni,
            telefono: usuario.telefono,
            correo: usuario.correo,
            contrasenaHash: '',
            colegiatura: usuario.colegiatura ?? '',
            regionUbicacion: usuario.regionUbicacion ?? '',
          });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.mensaje = `Error al cargar el usuario: ${error.error?.message ?? error.message}`;
          this.cdr.detectChanges();
        },
      });
    }
  }

  insertarUsuario(): void {
    if (this.formUsuarios.invalid) {
      this.formUsuarios.markAllAsTouched();
      this.mensaje = this.formUsuarios.controls['correo'].hasError('email')
        ? 'Ingrese un correo con formato válido.'
        : 'Por favor, complete todos los campos requeridos.';
      return;
    }

    const v = this.formUsuarios.getRawValue();
    const usuario: Usuarios = {
      idUsuario: this.isEditing ? v.idUsuario : 0,
      idRol: this.usuarioCargado?.idRol ?? 0,
      idEspecialidad: this.usuarioCargado?.idEspecialidad ?? null,
      nombres: v.nombres.trim(),
      apellidos: v.apellidos.trim(),
      dni: v.dni.trim(),
      telefono: v.telefono.trim(),
      correo: v.correo.trim(),
      contrasenaHash: v.contrasenaHash,
      colegiatura: v.colegiatura.trim(),
      regionUbicacion: v.regionUbicacion.trim(),
      estado: this.usuarioCargado?.estado ?? true,
    };

    const request = this.isEditing
      ? this.service.updateUsuario(usuario)
      : this.service.insertUsuario(usuario);
    request.subscribe({
      next: () => {
        if (this.isEditing) {
          this.router.navigate(['/usuarios/listar'], { state: { idActualizado: usuario.idUsuario } });
          return;
        }
        this.mensaje = 'Usuario registrado correctamente como PACIENTE.';
        this.formUsuarios.reset();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensaje = `Error al ${this.isEditing ? 'actualizar' : 'registrar'} el usuario: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }
}
