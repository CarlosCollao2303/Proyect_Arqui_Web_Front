import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { TiempoExamen } from '../../../models/TiempoExamen';
import { Examenesservice } from '../../../services/examenesservice';

// Mismos colores que el reporte de citas por especialidad: verde = listo, amarillo = pendiente
const COLOR_CON_RESULTADO = '#2A9D8F';
const COLOR_PENDIENTES = '#E9C46A';
const COLOR_DIAS = '#E76F51';
const COLOR_REFERENCIA = '#264653';

type TipoGrafico = 'bar' | 'line';

@Component({
  selector: 'app-reptiempoexamenescomponent',
  imports: [MatTableModule, BaseChartDirective, DecimalPipe],
  templateUrl: './reptiempoexamenescomponent.html',
  styleUrl: './reptiempoexamenescomponent.css',
})
export class Reptiempoexamenescomponent implements OnInit {
  // El back ya las devuelve de la entrega más lenta a la más rápida; sin resultados al final
  lista: TiempoExamen[] = [];
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  cargando = true;
  mensaje = '';
  // Chart.js necesita un canvas real, así que el gráfico solo se dibuja en el navegador
  esNavegador: boolean;

  // Resumen que se muestra sobre el gráfico
  totalSolicitados = 0;
  porcentajeConResultado = 0;
  promedioGeneral = 0;
  tiposSobrePromedio = 0;
  masLento: TiempoExamen | null = null;

  // Gráfico combinado: barras apiladas (con resultado / pendientes) y líneas (días de entrega)
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
          label: (item) => {
            if (item.parsed.y === null) return '';
            return item.dataset.yAxisID === 'y1'
              ? `${item.dataset.label}: ${item.parsed.y} días`
              : `${item.dataset.label}: ${item.parsed.y} exámenes`;
          },
          footer: (items) => {
            const fila = this.lista[items[0]?.dataIndex];
            return fila ? `Solicitados: ${fila.solicitados}` : '';
          },
        },
      },
    },
    scales: {
      x: { stacked: true, title: { display: true, text: 'Tipo de examen' } },
      y: {
        type: 'linear',
        position: 'left',
        stacked: true,
        beginAtZero: true,
        ticks: { precision: 0 },
        title: { display: true, text: 'Cantidad de exámenes' },
      },
      y1: {
        type: 'linear',
        position: 'right',
        beginAtZero: true,
        // Sin cuadrícula propia para no mezclarla con la del eje de cantidades
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Días hasta el resultado' },
      },
    },
  };

  constructor(private eS: Examenesservice,
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
    this.eS.getTiempoEntregaExamenes().subscribe({
      next: (data: TiempoExamen[]) => {
        this.lista = data;
        this.calcularResumen();
        this.actualizarGrafico();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.lista = [];
        this.cargando = false;
        this.mensaje = `Error al obtener el tiempo de entrega de exámenes: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  sobrePromedio(fila: TiempoExamen): boolean {
    return fila.diasPromedio !== null && fila.diasPromedio > this.promedioGeneral;
  }

  // El promedio general pondera por exámenes con resultado: un tipo con 20 pesa más que uno con 2
  private calcularResumen(): void {
    this.totalSolicitados = this.lista.reduce((suma, fila) => suma + fila.solicitados, 0);
    const conResultado = this.lista.reduce((suma, fila) => suma + fila.conResultado, 0);
    this.porcentajeConResultado = this.totalSolicitados > 0
      ? Math.round((conResultado * 1000) / this.totalSolicitados) / 10
      : 0;

    const dias = this.lista.reduce((suma, fila) => suma + (fila.diasPromedio ?? 0) * fila.conResultado, 0);
    this.promedioGeneral = conResultado > 0 ? Math.round((dias / conResultado) * 10) / 10 : 0;
    this.tiposSobrePromedio = this.lista.filter((fila) => this.sobrePromedio(fila)).length;
    // El primero es el más lento, salvo que ningún tipo tenga resultados todavía
    this.masLento = this.lista[0]?.diasPromedio != null ? this.lista[0] : null;
  }

  private actualizarGrafico(): void {
    this.chartData = {
      labels: this.lista.map((fila) => fila.tipoExamen),
      datasets: [
        {
          type: 'line',
          label: 'Días promedio',
          data: this.lista.map((fila) => fila.diasPromedio),
          yAxisID: 'y1',
          stack: 'dias',
          borderColor: COLOR_DIAS,
          backgroundColor: COLOR_DIAS,
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.3,
          // Los tipos sin resultados no tienen días: la línea se corta ahí
          spanGaps: false,
          order: 1,
        },
        {
          // Línea de referencia: los puntos por encima tardan más que el promedio
          type: 'line',
          label: `Promedio general (${this.promedioGeneral} días)`,
          data: this.lista.map(() => this.promedioGeneral),
          yAxisID: 'y1',
          stack: 'referencia',
          borderColor: COLOR_REFERENCIA,
          backgroundColor: COLOR_REFERENCIA,
          borderDash: [6, 6],
          borderWidth: 2,
          pointRadius: 0,
          pointStyle: 'line',
          order: 2,
        },
        {
          type: 'bar',
          label: 'Con resultado',
          data: this.lista.map((fila) => fila.conResultado),
          yAxisID: 'y',
          stack: 'examenes',
          backgroundColor: COLOR_CON_RESULTADO,
          borderColor: COLOR_CON_RESULTADO,
          borderRadius: 4,
          maxBarThickness: 56,
          pointStyle: 'rect',
          order: 3,
        },
        {
          type: 'bar',
          label: 'Pendientes',
          data: this.lista.map((fila) => fila.pendientes),
          yAxisID: 'y',
          stack: 'examenes',
          backgroundColor: COLOR_PENDIENTES,
          borderColor: COLOR_PENDIENTES,
          borderRadius: 4,
          maxBarThickness: 56,
          pointStyle: 'rect',
          order: 4,
        },
      ],
    };
  }
}
