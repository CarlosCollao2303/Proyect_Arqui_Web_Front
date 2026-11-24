import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LucideArrowLeft } from '@lucide/angular';
import { HistorialClinico } from '../../../models/HistorialClinico';
import { Historiasclinicasservice } from '../../../services/historiasclinicasservice';
import { fechaLocal } from '../../../utils/fechas';

@Component({
  selector: 'app-hhistorialcomponent',
  imports: [DatePipe, RouterLink, MatButtonModule, MatCardModule, LucideArrowLeft],
  templateUrl: './hhistorialcomponent.html',
  styleUrl: './hhistorialcomponent.css',
})
export class Hhistorialcomponent implements OnInit {
  historial: HistorialClinico | null = null;
  mensaje = '';
  // true en "Mi historia clínica": la ve el paciente y solo trae citas, exámenes y recetas
  vistaPaciente = false;

  constructor(private hS: Historiasclinicasservice,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Con id es el historial que abre el personal desde el listado; sin id es el del
    // paciente logueado (el back lo busca con el id que sale del token)
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.vistaPaciente = !(Number.isInteger(id) && id > 0);
    const pedido = this.vistaPaciente ? this.hS.getMiHistorial() : this.hS.getHistorial(id);

    this.mensaje = 'Cargando historial...';
    pedido.subscribe({
      next: (data) => {
        this.historial = data;
        this.mensaje = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensaje = error.status === 404 && this.vistaPaciente
          ? 'Todavía no tienes una historia clínica registrada. Se crea en tu primera consulta.'
          : `No se pudo cargar el historial: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  fecha(valor: string | Date | null | undefined): Date | null {
    return fechaLocal(valor);
  }

  hora(valor: string): string {
    return valor ? valor.substring(0, 5) : '';
  }
}
