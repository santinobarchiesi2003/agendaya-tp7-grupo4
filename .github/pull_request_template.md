## Qué cambia y por qué

<!-- Una o dos frases. Si es un hotfix: número de incidente y causa raíz. -->

- Incidente o tarea:
- Tipo: funcionalidad / corrección / **hotfix** (sale de `main`)

## Cómo se probó

- [ ] `npm run verificar` en mi máquina (formato, linter, tests unitarios y build)
- [ ] `npm run test:e2e` en mi máquina

## Solo para hotfix

**Autor**

- [ ] El cambio toca únicamente lo necesario para el incidente (sin refactors ni mejoras)
- [ ] Hay un test nuevo que reproduce el defecto, y este PR tiene una ejecución del pipeline en rojo anterior al fix
- [ ] Subí la versión (patch) en `package.json`
- [ ] Más abajo dice cómo revertir

**Revisor** (no puede ser quien escribió el fix)

- [ ] El diff se limita al incidente
- [ ] El test nuevo falla sin el fix y pasa con el fix (las dos ejecuciones están en el historial del PR)
- [ ] No se modificó ni se borró ningún test existente para que el pipeline pase
- [ ] Los dos checks del pipeline están en verde en el último commit

**Después del merge a `main`**

- [ ] Tag `vX.Y.Z` sobre el commit de merge
- [ ] PR de esta misma rama hacia `develop` (el incidente no se cierra sin ese merge)

## Cómo revertir

<!-- A qué versión se vuelve y qué se pierde al volver. -->
