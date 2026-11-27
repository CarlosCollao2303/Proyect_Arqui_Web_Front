# ProArquiWebFront

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.16.

## Correr SaludCerca en local

1. Levanta primero el backend en IntelliJ (ver el README del repositorio
   `Proyect_Arqui_Backend`). Queda en `http://localhost:8080`.
2. En esta carpeta ejecuta `npm install` y después `ng serve`.
3. Abre `http://localhost:4200` y entra con un usuario de prueba, por ejemplo
   `admin@saludcerca.pe` / `Admin123`.

A qué backend llama el front:

| Comando | Archivo de entorno | Backend |
|---|---|---|
| `ng serve` | `src/environments/environment.development.ts` | `http://localhost:8080` (local) |
| `ng build` (producción) | `src/environments/environment.ts` | `https://proyect-arqui-backend.onrender.com` (Render) |

Para probar el envío de correos ve a **Notificaciones > Enviar**, elige la cita
**#69 · Daniel Orellana Gutiérrez** y dale **Enviar correo**.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
