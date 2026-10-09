---
name: Incidente en producción
about: Registro de un incidente reportado por Soporte
title: "INC-XXXX · síntoma en una línea"
labels: incidente
---

## Datos del incidente

| Campo                | Valor |
| -------------------- | ----- |
| Identificador        |       |
| Severidad            |       |
| Módulo               |       |
| Reportado por        |       |
| Detectado (día/hora) |       |
| SLA de resolución    |       |
| Vence                |       |

## Síntoma

<!-- Tal como lo reporta el usuario o Soporte, sin interpretar la causa. -->

## Impacto

<!-- Cuántos usuarios o reservas, desde cuándo, si sigue ocurriendo. -->

## Clasificación

La completa el Tech Lead dentro de los 15 minutos del registro.

- [ ] El defecto está en producción (rama `main`)
- [ ] La severidad es crítica o alta y el usuario no tiene forma de evitarlo
- [ ] El SLA vence antes de la próxima versión planificada
- [ ] La corrección se puede acotar al defecto, sin rediseño

Con las cuatro marcadas es un **hotfix** (rama `hotfix/*` desde `main`). Si falta alguna es un cambio
ordinario (rama `feature/*` desde `develop`).

- Decisión:
- Autorizado por:
- Desarrollador:
- Revisor:

## Seguimiento

- [ ] Causa raíz identificada, con un test que la reproduce
- [ ] PR hacia `main` aprobado y mergeado
- [ ] Validado en staging
- [ ] Despliegue a producción aprobado por:
- [ ] Verificado en producción
- [ ] PR hacia `develop` mergeado
- [ ] Usuarios afectados notificados
- [ ] Informe del incidente publicado (causa raíz y acciones preventivas)
