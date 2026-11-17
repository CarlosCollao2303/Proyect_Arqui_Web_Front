import { inject } from '@angular/core';
import { Router } from '@angular/router';

// El back lista con findAll() sin ORDER BY: PostgreSQL devuelve las filas en su
// orden físico y un UPDATE suele mandar la fila editada al final de la tabla
// (por eso un registro recién actualizado "se perdía" en la última página).
// Se ordena aquí para que el listado tenga siempre el mismo orden.

/**
 * Devuelve una copia de la lista ordenada por id ascendente. Si se indica idPrimero,
 * ese registro va al inicio (el recién actualizado, para no perderlo de vista).
 */
export function ordenarListado<T>(lista: T[], id: (item: T) => number, idPrimero: number | null = null): T[] {
  const ordenada = [...lista].sort((a, b) => id(a) - id(b));
  const i = idPrimero === null ? -1 : ordenada.findIndex((item) => id(item) === idPrimero);
  if (i > 0) ordenada.unshift(...ordenada.splice(i, 1));
  return ordenada;
}

/**
 * Id del registro que se acaba de actualizar. El formulario lo manda en el estado de la
 * navegación al volver al listado: router.navigate([...], { state: { idActualizado } }).
 * Debe llamarse al crear el componente (inicializador de campo o constructor).
 */
export function idActualizadoDeLaNavegacion(): number | null {
  const id = inject(Router).currentNavigation()?.extras.state?.['idActualizado'];
  return typeof id === 'number' ? id : null;
}
