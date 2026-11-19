import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideCircleX, LucideSave } from '@lucide/angular';
import { Roles } from '../../../models/Roles';
import { Rolesservice } from '../../../services/rolesservice';

@Component({
  selector: 'app-roinsertarcomponent',
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule, RouterLink, LucideCircleX, LucideSave],
  templateUrl: './roinsertarcomponent.html',
  styleUrl: './roinsertarcomponent.css',
})
export class Roinsertarcomponent implements OnInit {
  formRoles: FormGroup;
  mensaje = '';
  isEditing = false;

  constructor(
    private service: Rolesservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.formRoles = this.fb.nonNullable.group({
      idRol: [0],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    // Si la ruta trae un id, estamos en modo actualizar
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isInteger(id) && id > 0) {
      this.isEditing = true;
      this.service.getRolById(id).subscribe({
        next: (rol) => {
          this.formRoles.patchValue(rol);
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.mensaje = `Error al cargar el rol: ${error.error?.message ?? error.message}`;
          this.cdr.detectChanges();
        },
      });
    }
  }

  insertarRol(): void {
    if (this.formRoles.invalid) {
      this.mensaje = 'Por favor, ingrese el nombre del rol.';
      return;
    }

    const rol: Roles = {
      idRol: this.isEditing ? this.formRoles.getRawValue().idRol : 0,
      nombre: this.formRoles.getRawValue().nombre.trim(),
    };

    const request = this.isEditing
      ? this.service.updateRol(rol)
      : this.service.insertRol(rol);
    request.subscribe({
      next: () => {
        if (this.isEditing) {
          this.router.navigate(['/roles/listar'], { state: { idActualizado: rol.idRol } });
          return;
        }
        this.mensaje = 'Rol registrado correctamente.';
        this.formRoles.reset();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensaje = `Error al ${this.isEditing ? 'actualizar' : 'registrar'} el rol: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }
}
