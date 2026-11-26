import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { LucideRefreshCw, LucideSearch } from '@lucide/angular';
import { CantidadDiagnosticos } from '../../../models/CantidadDiagnosticos';
import { Historiasclinicasservice } from '../../../services/historiasclinicasservice';

const COLOR_BARRA = '#176B87';
const COLOR_DESTACADA = '#E76F51';

// Alto de cada barra horizontal: el gráfico crece según la cantidad de historias
const ALTO_POR_BARRA = 38;
const ALTO_MINIMO = 260;

@Component({
  selector: 'app-repdiagnosticoshistoriacomponent',
  imports: [MatButtonModule, MatTableModule, BaseChartDirective, DecimalPipe, LucideRefreshCw, LucideSearch],
  templateUrl: './repdiagnosticoshistoriacomponent.html',
  styleUrl: './repdiagnosticoshistoriacomponent.css',
})
export class Repdiagnosticoshistoriacomponent implements OnInit {
  // El back ya las devuelve de mayor a menor cantidad de diagnósticos
  listaTodos: CantidadDiagnosticos[] = [];
  // Lo que se muestra en la tabla: todas o solo la historia buscada
  lista: CantidadDiagnosticos[] = [];
  displayedColumns: string[] = ['c1', 'c2', 'c3'];
  cargando = true;
  mensaje = '';
  mensajeBusqueda = '';
  // Historia buscada por ID: se resalta en el gráfico
  idDestacado: number | null = null;
  // Chart.js necesita un canvas real, así que el gráfico solo se dibuja en el navegador
  esNavegador: boolean;

  // Resumen que se muestra sobre el gráfico
  totalDiagnosticos = 0;
  promedioPorHistoria = 0;
  historiasSinDiagnosticos = 0;

  public chartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public chartOptions: ChartOptions<'bar'> = this.crearOpciones();

  constructor(private hS: Historiasclinicasservice,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.esNavegador = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.obtenerTodos();
  }

  get altoGrafico(): number {
    return Math.max(ALTO_MINIMO, this.listaTodos.length * ALTO_POR_BARRA);
  }

  get mayorCantidad(): CantidadDiagnosticos | null {
    return this.listaTodos.length > 0 && this.listaTodos[0].cantidadDiagnosticos > 0
      ? this.listaTodos[0]
      : null;
  }

  obtenerTodos(): void {
    this.cargando = true;
    this.mensaje = '';
    this.mensajeBusqueda = '';
    this.idDestacado = null;
    this.hS.getCantidadDiagnosticos().subscribe({
      next: (data: CantidadDiagnosticos[]) => {
        this.listaTodos = data;
        this.lista = data;
        this.calcularResumen();
        this.actualizarGrafico();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.listaTodos = [];
        this.lista = [];
        this.cargando = false;
        this.mensaje = `Error al obtener los diagnósticos por historia: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  buscarHistoria(idValue: string): void {
    const id = Number(idValue);
    if (!Number.isInteger(id) || id < 1) {
      this.mensajeBusqueda = 'Ingrese un ID de historia clínica válido.';
      return;
    }

    this.hS.getCantidadDiagnosticosDeHistoria(id).subscribe({
      next: (fila) => {
        this.lista = [fila];
        this.idDestacado = fila.idHistoriaClinica;
        this.mensajeBusqueda = '';
        this.actualizarGrafico();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.lista = [];
        this.idDestacado = null;
        this.mensajeBusqueda = `No se encontró la historia clínica: ${error.error?.message ?? error.message}`;
        this.actualizarGrafico();
        this.cdr.detectChanges();
      },
    });
  }

  private calcularResumen(): void {
    this.totalDiagnosticos = this.listaTodos.reduce((suma, fila) => suma + fila.cantidadDiagnosticos, 0);
    this.promedioPorHistoria = this.listaTodos.length > 0
      ? Math.round((this.totalDiagnosticos * 10) / this.listaTodos.length) / 10
      : 0;
    this.historiasSinDiagnosticos = this.listaTodos.filter((fila) => fila.cantidadDiagnosticos === 0).length;
  }

  // Barras horizontales: una barra por historia clínica; la buscada se pinta de otro color
  private actualizarGrafico(): void {
    this.chartData = {
      labels: this.listaTodos.map((fila) => `#${fila.idHistoriaClinica} - ${fila.paciente}`),
      datasets: [{
        label: 'Diagnósticos',
        data: this.listaTodos.map((fila) => fila.cantidadDiagnosticos),
        backgroundColor: this.listaTodos.map((fila) =>
          fila.idHistoriaClinica === this.idDestacado ? COLOR_DESTACADA : COLOR_BARRA),
        borderRadius: 4,
        maxBarThickness: 28,
      }],
    };
  }

  private crearOpciones(): ChartOptions<'bar'> {
    return {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => {
              const cantidad = item.parsed.x;
              return `${cantidad} diagnóstico${cantidad === 1 ? '' : 's'}`;
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { precision: 0 },
          title: { display: true, text: 'Cantidad de diagnósticos' },
        },
        y: { title: { display: true, text: 'Historia clínica' } },
      },
    };
  }
}
