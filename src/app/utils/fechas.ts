// El back manda las fechas como LocalDate ("2026-10-02"). new Date("2026-10-02") las
// interpreta como medianoche UTC, que en Perú (UTC-5) es el día anterior a las 19:00,
// y el datepicker muestra un día menos. Esto arma la fecha a medianoche LOCAL.
export function fechaLocal(valor: string | Date | null | undefined): Date | null {
  if (!valor) return null;
  if (valor instanceof Date) return valor;
  const [anio, mes, dia] = valor.substring(0, 10).split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}
