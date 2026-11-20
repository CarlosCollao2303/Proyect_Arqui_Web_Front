import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { LucideHash, LucidePercent } from '@lucide/angular';
import { CitasEspecialidad } from '../../../models/CitasEspecialidad';
import { Citasservice } from '../../../services/citasservice';

// Colores de cada estado: el verde azulado es el color secundario del tema
const COLOR_ATENDIDAS = '#2A9D8F';
const COLOR_PENDIENTES = '#E9C46A';
const COLOR_CANCELADAS = '#E76F51';

// A partir de este porcentaje de citas canceladas la especialidad se resalta en la tabla
const ALERTA_CANCELACION = 25;

@Component({
  selector: 'app-repcitasespecialidadcomponent',
  imports: [MatButtonModule, MatTableModule, BaseChartDirective, DecimalPipe, LucideHash, LucidePercent],
  templateUrl: './repcitasespecialidadcomponent.html',
  styleUrl: './repcitasespecialidadcomponent.css',
})
export class Repcitasespecialidadcomponent implements OnInit {
  lista: CitasEspecialidad[] = [];
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  cargando = true;
  mensaje = '';
  // Chart.js necesita un canvas real, así que el gráfico solo se dibuja en el navegador
  esNavegador: boolean;
  // false: cantidad de citas; true: porcentaje de cada estado dentro de su especialidad
  verPorcentaje = false;
  alertaCancelacion = ALERTA_CANCELACION;

  // Resumen que se muestra sobre el gráfico
  totalCitas = 0;
  porcentajeAtendidas = 0;
  mayorCancelacion: CitasEspecialidad | null = null;

  public chartType: 'bar' = 'bar';
  public chartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public chartOptions: ChartOptions<'bar'> = this.crearOpciones();

  constructor(private cS: Citasservice,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.esNavegador = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.obtenerReporte();
  }

  obtenerReporte(): void {
    this.cargando = true;
    this.mensaje = '';
    this.cS.getCitasPorEspecialidad().subscribe({
      next: (data: CitasEspecialidad[]) => {
        this.lista = data;
        this.calcularResumen();
        this.actualizarGrafico();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.lista = [];
        this.cargando = false;
        this.mensaje = `Error al obtener las citas por especialidad: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  cambiarVista(porcentaje: boolean): void {
    if (this.verPorcentaje === porcentaje) return;
    this.verPorcentaje = porcentaje;
    this.actualizarGrafico();
    this.cdr.detectChanges();
  }

  tasaCancelacion(fila: CitasEspecialidad): number {
    return this.porcentaje(fila.canceladas, fila.total);
  }

  private calcularResumen(): void {
    this.totalCitas = this.lista.reduce((suma, fila) => suma + fila.total, 0);
    const atendidas = this.lista.reduce((suma, fila) => suma + fila.atendidas, 0);
    this.porcentajeAtendidas = this.porcentaje(atendidas, this.totalCitas);
    // La especialidad que más cancela en proporción, no en cantidad
    this.mayorCancelacion = this.lista
      .filter((fila) => fila.canceladas > 0)
      .reduce<CitasEspecialidad | null>((mayor, fila) =>
        !mayor || this.tasaCancelacion(fila) > this.tasaCancelacion(mayor) ? fila : mayor, null);
  }

  private actualizarGrafico(): void {
    const valor = (fila: CitasEspecialidad, cantidad: number) =>
      this.verPorcentaje ? this.porcentaje(cantidad, fila.total) : cantidad;

    this.chartData = {
      labels: this.lista.map((fila) => fila.especialidad),
      datasets: [
        this.serie('Atendidas', this.lista.map((fila) => valor(fila, fila.atendidas)), COLOR_ATENDIDAS),
        this.serie('Pendientes', this.lista.map((fila) => valor(fila, fila.pendientes)), COLOR_PENDIENTES),
        this.serie('Canceladas', this.lista.map((fila) => valor(fila, fila.canceladas)), COLOR_CANCELADAS),
      ],
    };
    this.chartOptions = this.crearOpciones();
  }

  private serie(label: string, data: number[], color: string) {
    return {
      label,
      data,
      backgroundColor: color,
      borderColor: color,
      borderRadius: 4,
      maxBarThickness: 64,
    };
  }

  // Barras apiladas: cada barra es una especialidad y sus partes son los estados
  private crearOpciones(): ChartOptions<'bar'> {
    const porcentaje = this.verPorcentaje;
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (item) => porcentaje
              ? `${item.dataset.label}: ${item.parsed.y}%`
              : `${item.dataset.label}: ${item.parsed.y} citas`,
            footer: (items) => {
              const fila = this.lista[items[0]?.dataIndex];
              return fila ? `Total: ${fila.total} citas` : '';
            },
          },
        },
      },
      scales: {
        x: { stacked: true, title: { display: true, text: 'Especialidad' } },
        y: {
          stacked: true,
          beginAtZero: true,
          max: porcentaje ? 100 : undefined,
          ticks: {
            precision: 0,
            callback: (valor) => porcentaje ? `${valor}%` : valor,
          },
          title: { display: true, text: porcentaje ? 'Porcentaje de citas' : 'Cantidad de citas' },
        },
      },
    };
  }

  // Porcentaje con un decimal; si no hay citas devuelve 0 en vez de dividir entre cero
  private porcentaje(cantidad: number, total: number): number {
    return total > 0 ? Math.round((cantidad * 1000) / total) / 10 : 0;
  }
}
