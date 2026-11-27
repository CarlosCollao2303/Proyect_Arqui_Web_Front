import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { MedicosEspecialidad } from '../../../models/MedicosEspecialidad';
import { Especialidadesservice } from '../../../services/especialidadesservice';

// Un color por especialidad; si hay más especialidades que colores, se repiten en orden
const COLORES = ['#176B87', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', '#264653', '#8AB17D', '#B56576', '#6D597A', '#3A86FF'];
// La fila de médicos sin especialidad se pinta en gris para que no se confunda con una especialidad
const COLOR_SIN_ESPECIALIDAD = '#ADB5BD';

@Component({
  selector: 'app-repmedicosespecialidadcomponent',
  imports: [MatTableModule, BaseChartDirective, DecimalPipe],
  templateUrl: './repmedicosespecialidadcomponent.html',
  styleUrl: './repmedicosespecialidadcomponent.css',
})
export class Repmedicosespecialidadcomponent implements OnInit {
  // El back ya las devuelve de mayor a menor cantidad de médicos activos
  lista: MedicosEspecialidad[] = [];
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5'];
  cargando = true;
  mensaje = '';
  // Chart.js necesita un canvas real, así que el gráfico solo se dibuja en el navegador
  esNavegador: boolean;

  // Resumen que se muestra sobre el gráfico
  totalActivos = 0;
  especialidadesSinMedicos: MedicosEspecialidad[] = [];
  medicosSinEspecialidad = 0;

  // Gráfico de dona: cada porción es una especialidad y su tamaño, sus médicos activos
  public chartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  public chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '55%',
    plugins: {
      legend: { display: true, position: 'right' },
      tooltip: {
        callbacks: {
          label: (item) => {
            const cantidad = item.parsed;
            return `${item.label}: ${cantidad} médico${cantidad === 1 ? '' : 's'} (${this.porcentaje(cantidad)}%)`;
          },
        },
      },
    },
  };

  constructor(private eS: Especialidadesservice,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.esNavegador = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.obtenerReporte();
  }

  get mayorCobertura(): MedicosEspecialidad | null {
    const conEspecialidad = this.lista.filter((fila) => fila.idEspecialidad !== null && fila.activos > 0);
    return conEspecialidad.length > 0 ? conEspecialidad[0] : null;
  }

  obtenerReporte(): void {
    this.cargando = true;
    this.mensaje = '';
    this.eS.getReporteMedicos().subscribe({
      next: (data: MedicosEspecialidad[]) => {
        this.lista = data;
        this.calcularResumen();
        this.actualizarGrafico();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.lista = [];
        this.cargando = false;
        this.mensaje = `Error al obtener los médicos por especialidad: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  // Porcentaje de los médicos activos que pertenece a cada especialidad
  porcentaje(cantidad: number): number {
    return this.totalActivos > 0 ? Math.round((cantidad * 1000) / this.totalActivos) / 10 : 0;
  }

  private calcularResumen(): void {
    this.totalActivos = this.lista.reduce((suma, fila) => suma + fila.activos, 0);
    // Especialidades que el paciente no podría elegir porque no tienen médicos activos
    this.especialidadesSinMedicos = this.lista.filter((fila) => fila.idEspecialidad !== null && fila.activos === 0);
    this.medicosSinEspecialidad = this.lista
      .filter((fila) => fila.idEspecialidad === null)
      .reduce((suma, fila) => suma + fila.activos, 0);
  }

  // Solo entran al gráfico las filas con médicos activos: una porción de 0 no se vería
  private actualizarGrafico(): void {
    const filas = this.lista.filter((fila) => fila.activos > 0);
    this.chartData = {
      labels: filas.map((fila) => fila.especialidad),
      datasets: [{
        label: 'Médicos activos',
        data: filas.map((fila) => fila.activos),
        backgroundColor: filas.map((fila, i) =>
          fila.idEspecialidad === null ? COLOR_SIN_ESPECIALIDAD : COLORES[i % COLORES.length]),
        borderColor: '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 8,
      }],
    };
  }
}
