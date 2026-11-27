import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { DiagnosticoFrecuenteDTO } from '../../../models/DiagnosticoFrecuenteDTO';
import { Diagnosticosservice } from '../../../services/diagnosticosservice';

const COLOR_BARRA = '#176B87';
const ALTO_POR_FILA = 38;
const ALTO_MINIMO = 280;

@Component({
  selector: 'app-repdiagnosticosfrecuentescomponent',
  imports: [MatTableModule, BaseChartDirective],
  templateUrl: './repdiagnosticosfrecuentescomponent.html',
  styleUrl: './repdiagnosticosfrecuentescomponent.css',
})
export class Repdiagnosticosfrecuentescomponent implements OnInit {
  lista: DiagnosticoFrecuenteDTO[] = [];
  displayedColumns: string[] = ['codigo', 'descripcion', 'cantidad'];
  cargando = true;
  mensaje = '';
  esNavegador: boolean;
  totalDiagnosticos = 0;
  public chartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (item) => `${item.parsed.x} registros`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { precision: 0 },
        title: { display: true, text: 'Cantidad de registros' },
      },
      y: { title: { display: true, text: 'Diagnóstico (CIE-10)' } },
    },
  };

  constructor(
    private dS: Diagnosticosservice,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.esNavegador = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.obtenerReporte();
  }

  get altoGrafico(): number {
    return Math.max(ALTO_MINIMO, this.lista.length * ALTO_POR_FILA);
  }

  obtenerReporte(): void {
    this.cargando = true;
    this.mensaje = '';
    this.dS.getDiagnosticosFrecuentes().subscribe({
      next: (data) => {
        this.lista = data;
        this.totalDiagnosticos = data.reduce((suma, fila) => suma + fila.cantidad, 0);
        this.chartData = {
          labels: data.map((fila) => `${fila.codigoCie10} - ${fila.descripcion}`),
          datasets: [{
            label: 'Diagnósticos',
            data: data.map((fila) => fila.cantidad),
            backgroundColor: COLOR_BARRA,
            borderColor: COLOR_BARRA,
            borderRadius: 4,
            maxBarThickness: 32,
          }],
        };
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.lista = [];
        this.totalDiagnosticos = 0;
        this.cargando = false;
        this.mensaje = `Error al obtener los diagnósticos frecuentes: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }
}
