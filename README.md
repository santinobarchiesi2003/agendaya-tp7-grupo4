# AgendaYA — TP N.º 7: Plan de desarrollo y mantenimiento

Trabajo Práctico N.º 7 de Ingeniería y Calidad de Software (UTN FRM, 4K10 — Grupo 4), sobre los módulos
**M01 (Autenticación)** y **M04 (Booking público)** del sistema AgendaYA. Parte de la aplicación y los
tests del [TP6](https://github.com/maxidoe2/agendaya-tp6-grupo4) y les agrega un pipeline de integración
continua y el proceso para resolver un incidente de producción con un hotfix.

**Integrantes:** Barchiesi Santino (50791), Estudillo Máximo (50013) y Navarro Matías (51006).

| Qué                          | Dónde                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------- |
| Pipeline (GitHub Actions)    | [`.github/workflows/ci.yml`](.github/workflows/ci.yml)                       |
| Reglas de formato (Prettier) | [`.prettierrc.json`](.prettierrc.json)                                       |
| Reglas del linter (ESLint)   | [`eslint.config.js`](eslint.config.js)                                       |
| Build                        | [`scripts/build.js`](scripts/build.js)                                       |
| Tests unitarios (Jest)       | [`tests/unit/`](tests/unit)                                                  |
| Tests E2E (Cypress)          | [`cypress/e2e/`](cypress/e2e)                                                |
| Plantilla de Pull Request    | [`.github/pull_request_template.md`](.github/pull_request_template.md)       |
| Plantilla de incidente       | [`.github/ISSUE_TEMPLATE/incidente.md`](.github/ISSUE_TEMPLATE/incidente.md) |

## Requisitos

- Node.js 22 (el mismo que usa el pipeline). ESLint 10 necesita como mínimo Node 20.19.
- La primera instalación descarga el binario de Cypress (~500 MB).

## Puesta en marcha

```
npm install
npm start
```

Abrir `http://localhost:3000`. Para volver al estado inicial: `npm run reset`.

| Correo                   | Contraseña     |
| ------------------------ | -------------- |
| admin@agendaya.com       | Contrasena123! |
| hola.comova@agendaya.com | Recuperar2025! |

## Verificaciones

Son los mismos comandos que corre el pipeline. Conviene correrlos antes de subir un cambio.

| Comando                | Qué verifica                                                                  |
| ---------------------- | ----------------------------------------------------------------------------- |
| `npm run format:check` | Que todo el código esté formateado con Prettier (`npm run format` lo corrige) |
| `npm run lint`         | Buenas prácticas de JavaScript con ESLint, también en los `<script>` del HTML |
| `npm run test:unit`    | Tests unitarios (Jest)                                                        |
| `npm run build`        | Que se pueda armar el paquete de la aplicación en `dist/`                     |
| `npm run verificar`    | Los cuatro anteriores, en ese orden                                           |
| `npm run test:e2e`     | Levanta el servidor y corre los tests E2E (Cypress)                           |

**Aviso:** cada test E2E reinicia la base (`data/db.json`), así que borra las reservas y cuentas creadas a
mano.

JavaScript no se compila y el proyecto no usa un empaquetador. El build junta lo que corre en el servidor
(`server/`, `src/` y `frontend/`) en `dist/agendaya-tp7-grupo4-<versión>.tgz` y falla si al paquete le
falta un archivo de la aplicación o si incluye tests. Ese paquete es el que se instala en cada ambiente.

## Pipeline

El workflow [`CI`](.github/workflows/ci.yml) corre ante cada Pull Request hacia `main` o hacia `develop`,
y también sobre el resultado de cada merge a esas ramas. Tiene dos jobs que corren en paralelo:

| Job                                      | Pasos                                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Formato, linter, tests unitarios y build | Formato (Prettier) · Linter (ESLint) · Tests unitarios (Jest) · Build (paquete de la aplicación) |
| Tests E2E (Cypress)                      | Levanta el servidor y corre todos los tests de `cypress/e2e/`                                    |

Las cuatro verificaciones del primer job corren aunque falle una anterior, para que una sola ejecución
muestre todo lo que hay que corregir. El paquete del build queda guardado como artefacto de la ejecución
(`paquete-agendaya`), y las capturas y videos de Cypress también (`evidencia-cypress`).

`main` y `develop` están protegidas: no aceptan push directo, cada Pull Request necesita la aprobación de
otro integrante y los dos jobs en verde. La regla vale también para los administradores del repositorio.

## Ramas y versiones

| Rama        | Para qué                                                      | Nace de   | Vuelve a           |
| ----------- | ------------------------------------------------------------- | --------- | ------------------ |
| `main`      | Lo que está en producción. Cada despliegue lleva un tag       | —         | —                  |
| `develop`   | Integración de la próxima versión                             | `main`    | `main`             |
| `feature/*` | Una funcionalidad o corrección que sale en la próxima versión | `develop` | `develop`          |
| `hotfix/*`  | Corrección urgente de un defecto que está en producción       | `main`    | `main` y `develop` |

Un hotfix sigue siempre estos pasos:

1. Soporte registra el incidente con la plantilla y el Tech Lead lo clasifica y autoriza.
2. Se crea `hotfix/INC-XXXX-descripcion` desde el tag que está en producción.
3. Primer commit: un test que reproduce el defecto. El pipeline tiene que fallar.
4. Segundo commit: la corrección y la versión nueva (patch). El pipeline tiene que pasar.
5. Otro integrante revisa y aprueba el Pull Request hacia `main`.
6. Se etiqueta el commit de merge (`vX.Y.Z`) y se despliega ese paquete.
7. Se abre el Pull Request de la misma rama hacia `develop`. El incidente no se cierra sin ese merge.

Las versiones siguen `MAYOR.MENOR.PARCHE`: una funcionalidad nueva sube el número menor y un hotfix sube el
parche.

## Estructura

```
.github/             Pipeline y plantillas de Pull Request e incidente
frontend/            Pantallas (HTML + CSS + JS) con atributos data-cy
server/              Express: endpoints, persistencia en JSON y correo simulado
src/logica/          Lógica de negocio, compartida por navegador, servidor y tests
tests/unit/          Tests unitarios (Jest)
cypress/e2e/         Tests E2E (Cypress)
scripts/build.js     Build: arma y verifica el paquete de la aplicación
```
