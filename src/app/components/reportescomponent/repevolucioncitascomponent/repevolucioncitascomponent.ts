import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { LucideTrendingDown, LucideTrendingUp } from '@lucide/angular';
import { CitasMes } from '../../../models/CitasMes';
import { Citasservice } from '../../../services/citasservice';

// Mismos colores de estado que el reporte de citas por especialidad
const COLOR_ATENDIDAS = '#2A9D8F';
const COLOR_PENDIENTES = '#E9C46A';
const COLOR_CANCELADAS = '#E76F51';
const COLOR_TASA = '#264653';

// Igual que en citas por especialidad: desde este porcentaje de cancelación se resalta el mes
const ALERTA_CANCELACION = 25;

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

type TipoGrafico = 'bar' | 'line';

@Component({
  selector: 'app-repevolucioncitascomponent',
  imports: [MatFormFieldModule, MatSelectModule, MatTableModule, BaseChartDirective, DecimalPipe,
    LucideTrendingUp, LucideTrendingDown],
  templateUrl: './repevolucioncitascomponent.html',
  styleUrl: './repevolucioncitascomponent.css',
})
export class Repevolucioncitascomponent implements OnInit {
  // Siempre 12 filas, de enero a diciembre
  lista: CitasMes[] = [];
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];
  cargando = true;
  mensaje = '';
  // Chart.js necesita un canvas real, así que el gráfico solo se dibuja en el navegador
  esNavegador: boolean;
  alertaCancelacion = ALERTA_CANCELACION;

  // Años con citas para el selector; se muestra el actual si tiene citas, si no el más reciente
  anios: number[] = [];
  anioSeleccionado = new Date().getFullYear();

  // Resumen que se muestra sobre el gráfico
  totalAnio = 0;
  tasaAnual = 0;
  mesMayor: CitasMes | null = null;

  public chartType: TipoGrafico = 'bar';
  public chartData: ChartData<TipoGrafico, (number | null)[], string> = { labels: [], datasets: [] };
  public chartOptions: ChartOptions<TipoGrafico> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: true, position: 'bottom', labels: { usePointStyle: true } },
      tooltip: {
        callbacks: {
          title: (items) => {
            const fila = this.lista[items[0]?.dataIndex];
            return fila ? `${this.nombreMes(fila.mes)} ${this.anioSeleccionado}` : '';
          },
          label: (item) => {
            if (item.parsed.y === null) return '';
            return item.dataset.yAxisID === 'y1'
              ? `${item.dataset.label}: ${item.parsed.y}%`
              : `${item.dataset.label}: ${item.parsed.y} citas`;
          },
          footer: (items) => {
            const fila = this.lista[items[0]?.dataIndex];
            return fila ? `Total: ${fila.total} citas` : '';
          },
        },
      },
    },
    scales: {
      x: { stacked: true, title: { display: true, text: 'Mes' } },
      y: {
        type: 'linear',
        position: 'left',
        stacked: true,
        beginAtZero: true,
        ticks: { precision: 0 },
        title: { display: true, text: 'Cantidad de citas' },
      },
      y1: {
        type: 'linear',
        position: 'right',
        min: 0,
        max: 100,
        // Sin cuadrícula propia para no mezclarla con la del eje de citas
        grid: { drawOnChartArea: false },
        ticks: { callback: (valor) => `${valor}%` },
        title: { display: true, text: '% de cancelación' },
      },
    },
  };

  constructor(private cS: Citasservice,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.esNavegador = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.obtenerAnios();
  }

  // Primero se piden los años con citas para saber cuál mostrar
  obtenerAnios(): void {
    this.cargando = true;
    this.mensaje = '';
    this.cS.getAniosConCitas().subscribe({
      next: (anios: number[]) => {
        this.anios = anios;
        if (anios.length === 0) {
          this.lista = [];
          this.cargando = false;
          this.cdr.detectChanges();
          return;
        }
        if (!anios.includes(this.anioSeleccionado)) {
          this.anioSeleccionado = anios[0];
        }
        this.obtenerReporte();
      },
      error: (error) => {
        this.cargando = false;
        this.mensaje = `Error al obtener los años con citas: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  cambiarAnio(anio: number): void {
    if (anio === this.anioSeleccionado) return;
    this.anioSeleccionado = anio;
    this.obtenerReporte();
  }

  obtenerReporte(): void {
    this.cargando = true;
    this.mensaje = '';
    this.cS.getEvolucionMensual(this.anioSeleccionado).subscribe({
      next: (data: CitasMes[]) => {
        this.lista = data;
        this.calcularResumen();
        this.actualizarGrafico();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.lista = [];
        this.cargando = false;
        this.mensaje = `Error al obtener la evolución mensual de citas: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  nombreMes(mes: number): string {
    return MESES[mes - 1] ?? '';
  }

  tasaCancelacion(fila: CitasMes): number {
    return this.porcentaje(fila.canceladas, fila.total);
  }

  // Cambio de citas frente al mes anterior. null si no se puede comparar
  // (enero no tiene mes anterior en el año y un mes sin citas no sirve de base).
  variacion(index: number): number | null {
    const anterior = this.lista[index - 1];
    const actual = this.lista[index];
    if (!anterior || !actual || anterior.total === 0) return null;
    return Math.round(((actual.total - anterior.total) * 1000) / anterior.total) / 10;
  }

  private calcularResumen(): void {
    this.totalAnio = this.lista.reduce((suma, fila) => suma + fila.total, 0);
    const canceladas = this.lista.reduce((suma, fila) => suma + fila.canceladas, 0);
    this.tasaAnual = this.porcentaje(canceladas, this.totalAnio);
    this.mesMayor = this.lista
      .filter((fila) => fila.total > 0)
      .reduce<CitasMes | null>((mayor, fila) => !mayor || fila.total > mayor.total ? fila : mayor, null);
  }

  private actualizarGrafico(): void {
    this.chartData = {
      labels: this.lista.map((fila) => this.nombreMes(fila.mes).substring(0, 3)),
      datasets: [
        {
          type: 'line',
          label: '% de cancelación',
          // Los meses sin citas no tienen porcentaje: la línea se corta ahí
          data: this.lista.map((fila) => fila.total > 0 ? this.tasaCancelacion(fila) : null),
          yAxisID: 'y1',
          stack: 'tasa',
          borderColor: COLOR_TASA,
          backgroundColor: COLOR_TASA,
          borderDash: [6, 4],
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.3,
          spanGaps: false,
          order: 1,
        },
        this.serie('Atendidas', this.lista.map((fila) => fila.atendidas), COLOR_ATENDIDAS, 2),
        this.serie('Pendientes', this.lista.map((fila) => fila.pendientes), COLOR_PENDIENTES, 3),
        this.serie('Canceladas', this.lista.map((fila) => fila.canceladas), COLOR_CANCELADAS, 4),
      ],
    };
  }

  private serie(label: string, data: number[], color: string, order: number) {
    return {
      type: 'bar' as const,
      label,
      data,
      yAxisID: 'y',
      stack: 'citas',
      backgroundColor: color,
      borderColor: color,
      borderRadius: 4,
      maxBarThickness: 48,
      pointStyle: 'rect' as const,
      order,
    };
  }

  // Porcentaje con un decimal; si no hay citas devuelve 0 en vez de dividir entre cero
  private porcentaje(cantidad: number, total: number): number {
    return total > 0 ? Math.round((cantidad * 1000) / total) / 10 : 0;
  }
}
