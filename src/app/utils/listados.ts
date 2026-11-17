// El back lista con findAll() sin ORDER BY: PostgreSQL devuelve las filas en su
// orden físico y un UPDATE suele mandar la fila editada al final de la tabla
// (por eso un registro recién actualizado "se perdía" en la última página).
// Se ordena aquí para que el listado tenga siempre el mismo orden.

/** Devuelve una copia de la lista ordenada por id ascendente. */
export function ordenarListado<T>(lista: T[], id: (item: T) => number): T[] {
  return [...lista].sort((a, b) => id(a) - id(b));
}
