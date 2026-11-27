// Fila del reporte de evolución mensual de citas (GET /api/citas/evolucion-mensual?anio=)
// El back siempre devuelve los 12 meses; los que no tienen citas vienen en cero.
export class CitasMes {
    // 1 = enero ... 12 = diciembre
    mes: number = 0;
    atendidas: number = 0;
    pendientes: number = 0;
    canceladas: number = 0;
    total: number = 0;
}
