import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { EsperaMedico } from '../../../models/EsperaMedico';
import { Citasservice } from '../../../services/citasservice';

const COLOR_CITAS = '#176B87';
const COLOR_ESPERA = '#E76F51';
const COLOR_REFERENCIA = '#264653';

type TipoGrafico = 'bar' | 'line';

@Component({
  selector: 'app-repesperamedicocomponent',
  imports: [MatTableModule, BaseChartDirective, DecimalPipe],
  templateUrl: './repesperamedicocomponent.html',
  styleUrl: './repesperamedicocomponent.css',
})
export class Repesperamedicocomponent implements OnInit {
  // El back ya las devuelve de mayor a menor espera promedio
  lista: EsperaMedico[] = [];
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5'];
  cargando = true;
  mensaje = '';
  // Chart.js necesita un canvas real, así que el gráfico solo se dibuja en el navegador
  esNavegador: boolean;

  // Resumen que se muestra sobre el gráfico
  totalAtendidas = 0;
  promedioGeneral = 0;
  medicosSobrePromedio = 0;

  // Gráfico combinado: barras (citas atendidas) y líneas (minutos de espera)
  public chartType: TipoGrafico = 'bar';
  public chartData: ChartData<TipoGrafico, number[], string> = { labels: [], datasets: [] };
  public chartOptions: ChartOptions<TipoGrafico> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: {
        callbacks: {
          title: (items) => {
            const fila = this.lista[items[0]?.dataIndex];
            return fila ? `${fila.medico} (${fila.especialidad})` : '';
          },
          label: (item) => item.dataset.yAxisID === 'y1'
            ? `${item.dataset.label}: ${item.parsed.y} min`
            : `${item.dataset.label}: ${item.parsed.y}`,
        },
      },
    },
    scales: {
      x: { title: { display: true, text: 'Médico' } },
      y: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        ticks: { precision: 0 },
        title: { display: true, text: 'Citas atendidas' },
      },
      y1: {
        type: 'linear',
        position: 'right',
        beginAtZero: true,
        // Sin cuadrícula propia para no mezclarla con la del eje de citas
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Minutos de espera' },
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
    this.obtenerReporte();
  }

  obtenerReporte(): void {
    this.cargando = true;
    this.mensaje = '';
    this.cS.getEsperaPorMedico().subscribe({
      next: (data: EsperaMedico[]) => {
        this.lista = data;
        this.calcularResumen();
        this.actualizarGrafico();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.lista = [];
        this.cargando = false;
        this.mensaje = `Error al obtener el tiempo de espera por médico: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  sobrePromedio(fila: EsperaMedico): boolean {
    return fila.esperaPromedio > this.promedioGeneral;
  }

  // El promedio general pondera por citas: un médico con 20 citas pesa más que uno con 2
  private calcularResumen(): void {
    this.totalAtendidas = this.lista.reduce((suma, fila) => suma + fila.citasAtendidas, 0);
    const minutos = this.lista.reduce((suma, fila) => suma + fila.esperaPromedio * fila.citasAtendidas, 0);
    this.promedioGeneral = this.totalAtendidas > 0
      ? Math.round((minutos / this.totalAtendidas) * 10) / 10
      : 0;
    this.medicosSobrePromedio = this.lista.filter((fila) => this.sobrePromedio(fila)).length;
  }

  private actualizarGrafico(): void {
    this.chartData = {
      labels: this.lista.map((fila) => fila.medico),
      datasets: [
        {
          type: 'line',
          label: 'Espera promedio',
          data: this.lista.map((fila) => fila.esperaPromedio),
          yAxisID: 'y1',
          borderColor: COLOR_ESPERA,
          backgroundColor: COLOR_ESPERA,
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.3,
          order: 1,
        },
        {
          // Línea de referencia: los puntos por encima esperan más que el promedio
          type: 'line',
          label: `Promedio general (${this.promedioGeneral} min)`,
          data: this.lista.map(() => this.promedioGeneral),
          yAxisID: 'y1',
          borderColor: COLOR_REFERENCIA,
          backgroundColor: COLOR_REFERENCIA,
          borderDash: [6, 6],
          borderWidth: 2,
          pointRadius: 0,
          order: 2,
        },
        {
          type: 'bar',
          label: 'Citas atendidas',
          data: this.lista.map((fila) => fila.citasAtendidas),
          yAxisID: 'y',
          backgroundColor: COLOR_CITAS,
          borderColor: COLOR_CITAS,
          borderRadius: 6,
          maxBarThickness: 56,
          order: 3,
        },
      ],
    };
  }
}
