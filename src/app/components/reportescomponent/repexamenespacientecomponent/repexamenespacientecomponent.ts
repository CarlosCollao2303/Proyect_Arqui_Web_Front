import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { LucideRefreshCw, LucideSearch } from '@lucide/angular';
import { CantidadExamenes } from '../../../models/CantidadExamenes';
import { Examenesservice } from '../../../services/examenesservice';

@Component({
  selector: 'app-repexamenespacientecomponent',
  imports: [MatButtonModule, MatTableModule, MatPaginatorModule, BaseChartDirective, LucideRefreshCw, LucideSearch],
  templateUrl: './repexamenespacientecomponent.html',
  styleUrl: './repexamenespacientecomponent.css',
})
export class Repexamenespacientecomponent implements OnInit {
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4'];
  // Se respeta el orden del back: de mayor a menor cantidad
  dataSource = new MatTableDataSource<CantidadExamenes>([]);
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    if (paginator) this.dataSource.paginator = paginator;
  }
  // El gráfico siempre muestra a todos los pacientes, aunque la tabla esté filtrada
  listaTodos: CantidadExamenes[] = [];
  cargando = true;
  mensaje = '';
  mensajeBusqueda = '';
  // Chart.js necesita un canvas real, así que el gráfico solo se dibuja en el navegador
  esNavegador: boolean;

  chartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { title: { display: true, text: 'Paciente' } },
      y: { beginAtZero: true, ticks: { precision: 0 }, title: { display: true, text: 'Cantidad de exámenes' } },
    },
  };

  constructor(private eS: Examenesservice,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.esNavegador = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.obtenerTodos();
  }

  obtenerTodos() {
    this.cargando = true;
    this.mensaje = '';
    this.mensajeBusqueda = '';
    this.eS.getCantidadExamenesPorPaciente().subscribe({
      next: (data) => {
        this.listaTodos = data;
        this.dataSource.data = data;
        this.dataSource.paginator?.firstPage();
        this.actualizarGrafico(data);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.listaTodos = [];
        this.dataSource.data = [];
        this.cargando = false;
        this.mensaje = `Error al obtener la cantidad de exámenes: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  buscarPaciente(idValue: string): void {
    const id = Number(idValue);
    if (!Number.isInteger(id) || id < 1) {
      this.mensajeBusqueda = 'Ingrese un ID válido.';
      return;
    }

    this.eS.getCantidadExamenesDePaciente(id).subscribe({
      next: (data) => {
        this.dataSource.data = [data];
        this.dataSource.paginator?.firstPage();
        this.mensajeBusqueda = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.dataSource.data = [];
        this.dataSource.paginator?.firstPage();
        this.mensajeBusqueda = `No se encontró el paciente: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  private actualizarGrafico(data: CantidadExamenes[]) {
    const color = this.colorPrimario();
    this.chartData = {
      labels: data.map((p) => p.paciente),
      datasets: [
        {
          data: data.map((p) => p.cantidadExamenes),
          label: 'Exámenes',
          backgroundColor: color,
          borderColor: color,
          borderRadius: 6,
          maxBarThickness: 48,
        },
      ],
    };
  }

  // Usa el color primario del tema definido en styles.css
  private colorPrimario(): string {
    if (!this.esNavegador) return '#176B87';
    const valor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
    return valor || '#176B87';
  }
}
