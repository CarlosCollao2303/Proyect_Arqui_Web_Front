import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideArrowLeft, LucideShieldCheck, LucideStethoscope } from '@lucide/angular';
import { Usuarios } from '../../../models/Usuarios';
import { Roles } from '../../../models/Roles';
import { Especialidades } from '../../../models/Especialidades';
import { Usuariosservice } from '../../../services/usuariosservice';
import { Rolesservice } from '../../../services/rolesservice';
import { Especialidadesservice } from '../../../services/especialidadesservice';

@Component({
  selector: 'app-uasignarcomponent',
  imports: [MatButtonModule, MatCardModule, MatSelectModule, ReactiveFormsModule, RouterLink, LucideArrowLeft, LucideShieldCheck, LucideStethoscope],
  templateUrl: './uasignarcomponent.html',
  styleUrl: './uasignarcomponent.css',
})
export class Uasignarcomponent implements OnInit {
  idUsuario = 0;
  usuario: Usuarios | null = null;
  listaRoles: Roles[] = [];
  listaEspecialidades: Especialidades[] = [];
  rolControl = new FormControl<number | null>(null);
  especialidadControl = new FormControl<number | null>({ value: null, disabled: true });
  mensaje = '';
  asignando = false;

  constructor(private uS: Usuariosservice,
    private rS: Rolesservice,
    private eS: Especialidadesservice,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.idUsuario = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(this.idUsuario) || this.idUsuario < 1) {
      this.mensaje = 'ID de usuario inválido.';
      return;
    }

    this.listarRoles();
    this.listarEspecialidades();
    this.obtenerUsuario();
  }

  obtenerUsuario() {
    this.uS.getUsuarioById(this.idUsuario).subscribe({
      next: (data) => {
        this.usuario = data;
        this.rolControl.setValue(data.idRol);
        this.especialidadControl.setValue(data.idEspecialidad);
        this.actualizarSelectEspecialidad();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensaje = `Error al cargar el usuario: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  listarRoles() {
    this.rS.getListRoles().subscribe({
      next: (data) => {
        this.listaRoles = data;
        this.actualizarSelectEspecialidad();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error al obtener los roles:', err);
      },
    });
  }

  listarEspecialidades() {
    this.eS.getListEspecialidades().subscribe({
      next: (data) => {
        this.listaEspecialidades = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error al obtener las especialidades:', err);
      },
    });
  }

  nombreRol(idRol: number | undefined): string {
    return this.listaRoles.find((r) => r.idRol === idRol)?.nombre ?? '';
  }

  nombreEspecialidad(idEspecialidad: number | null | undefined): string {
    return this.listaEspecialidades.find((e) => e.idEspecialidad === idEspecialidad)?.nombre ?? 'Sin especialidad';
  }

  // El back solo acepta asignar especialidad a usuarios con rol MEDICO
  esMedico(): boolean {
    return this.nombreRol(this.usuario?.idRol) === 'MEDICO';
  }

  private actualizarSelectEspecialidad() {
    if (this.esMedico()) {
      this.especialidadControl.enable();
    } else {
      this.especialidadControl.disable();
    }
  }

  asignarRol() {
    const idRol = this.rolControl.value;
    if (!idRol) {
      this.mensaje = 'Seleccione un rol.';
      return;
    }

    this.asignando = true;
    this.uS.asignarRol(this.idUsuario, idRol).subscribe({
      next: () => {
        this.asignando = false;
        this.mensaje = `Rol ${this.nombreRol(idRol)} asignado correctamente.`;
        this.obtenerUsuario();
      },
      error: (error) => {
        this.asignando = false;
        this.mensaje = `No se pudo asignar el rol: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  asignarEspecialidad() {
    const idEspecialidad = this.especialidadControl.value;
    if (!idEspecialidad) {
      this.mensaje = 'Seleccione una especialidad.';
      return;
    }

    this.asignando = true;
    this.uS.asignarEspecialidad(this.idUsuario, idEspecialidad).subscribe({
      next: () => {
        this.asignando = false;
        this.mensaje = `Especialidad ${this.nombreEspecialidad(idEspecialidad)} asignada correctamente.`;
        this.obtenerUsuario();
      },
      error: (error) => {
        this.asignando = false;
        this.mensaje = `No se pudo asignar la especialidad: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }
}
