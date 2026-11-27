import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { ConteoNotificacionesEstadoDTO } from '../../../models/ConteoNotificacionesEstadoDTO';
import { Notificacionesservice } from '../../../services/notificacionesservice';

const COLOR_BARRA = '#176B87';

@Component({
  selector: 'app-repnotificacionesestadocomponent',
  imports: [MatTableModule, BaseChartDirective],
  templateUrl: './repnotificacionesestadocomponent.html',
  styleUrl: './repnotificacionesestadocomponent.css',
})
export class Repnotificacionesestadocomponent implements OnInit {
  lista: ConteoNotificacionesEstadoDTO[] = [];
  displayedColumns: string[] = ['estado', 'total'];
  cargando = true;
  mensaje = '';
  esNavegador: boolean;
  totalNotificaciones = 0;
  public chartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (item) => `${item.parsed.x} notificaciones`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { precision: 0 },
        title: { display: true, text: 'Cantidad de notificaciones' },
      },
      y: { title: { display: true, text: 'Estado de envío' } },
    },
  };

  constructor(
    private nS: Notificacionesservice,
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
    this.nS.getConteoPorEstado().subscribe({
      next: (data) => {
        this.lista = data;
        this.totalNotificaciones = data.reduce((suma, fila) => suma + fila.total, 0);
        this.chartData = {
          labels: data.map((fila) => fila.estadoEnvio),
          datasets: [{
            label: 'Notificaciones',
            data: data.map((fila) => fila.total),
            backgroundColor: COLOR_BARRA,
            borderColor: COLOR_BARRA,
            borderRadius: 4,
            maxBarThickness: 48,
          }],
        };
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.lista = [];
        this.totalNotificaciones = 0;
        this.cargando = false;
        this.mensaje = `Error al obtener las notificaciones por estado: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }
}
