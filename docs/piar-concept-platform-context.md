# Contexto de Integracion: `piar-concept-platform` -> `piar-turbo-template`

## Repos

- Source (empresa): `/Users/polribasrovira/Documents/piar-concept/company/repositories/piar-concept-platform`
- Target (este workspace): `/Users/polribasrovira/Documents/piar-concept/temp/piar-turbo-template`

## Objetivo de este documento

Tener una guia de copiado directo (rutas y comandos) para traer features del repo source al template, con los puntos de adaptacion que suelen romper (DI, puertos, exports, mensajes e imports).

## Estado actual del gap

### Ya alineado (no hace falta copiar)

- Infra de cliente para tabla dinamica:
  - `packages/infra/client/dynamic-table/src/query-params.ts` (igual en ambos repos)
  - `packages/infra/client/dynamic-table/src/create-dynamic-table-client.ts` (igual en ambos repos)
- Monorepo base (Turbo, pnpm workspace, apps base, paquetes base) ya coincide.

### Diferencias grandes (source tiene mas superficie)

1. `packages/features/*`
   - En target solo estan: `auth`, `comingSoon`, `cookies`, `health`
   - Faltan en target: `client`, `contact`, `cron`, `dynamic-page`, `media`, `product`, `project`, `project-template`, `repository`, `service`
2. `packages/infra/backend/repositories/src/*`
   - En target solo esta `account`
   - Source incluye `client`, `client-*`, `contact-submission`, `project`, `project-template`, `repository`, `product`, `service`, `dynamic-page`, `statistics`
3. Dominio:
   - `packages/domain/models/src/entities` en source exporta muchas entidades extra (client, project, product, etc.)
   - `packages/domain/fields/src/entities` en source incluye `*EntityFieldsConfig` para todas esas entidades
4. Mensajes:
   - Source usa `fields` y `website` (ademas de `dashboard`)
   - Target aun usa `modules` y no tiene `fields`/`website`
5. Wiring de apps:
   - `apps/api/backoffice-bff/src/app.module.ts` en source registra muchos modulos/puertos (client, project, repository, etc.)
   - `apps/api/web-bff/src/app.module.ts` en source registra modulos web (WebClientModule, WebProjectModule, etc.)

## Archivos clave de referencia (source)

- Arquitectura y reglas:
  - `docs/AI-context.md`
  - `docs/features/creating-features-guide.md`
  - `docs/features/repository-configuration.md`
- Wiring BFF:
  - `apps/api/backoffice-bff/src/app.module.ts`
  - `apps/api/web-bff/src/app.module.ts`
- Repositorio infra:
  - `packages/infra/backend/repositories/src/index.ts`
  - `packages/infra/backend/repositories/src/*`
- TipoORM compartido:
  - `packages/infra/backend/common/typeorm/src/typeorm.module.ts`
- Ejemplo migrado de account (typeorm real):
  - `packages/infra/backend/repositories/src/account/orm.entity.ts`
  - `packages/infra/backend/repositories/src/account/repository.ts`

## Copiado directo por bloques

Nota: usa `rsync` y excluye artefactos (`dist`, `node_modules`, `.turbo`, `coverage`, `.DS_Store`).

```bash
SRC="/Users/polribasrovira/Documents/piar-concept/company/repositories/piar-concept-platform"
DST="/Users/polribasrovira/Documents/piar-concept/temp/piar-turbo-template"

EXCLUDES=(
  "--exclude=node_modules"
  "--exclude=dist"
  "--exclude=.turbo"
  "--exclude=coverage"
  "--exclude=.next"
  "--exclude=.DS_Store"
)
```

### 1) Features faltantes (`packages/features/*`)

```bash
for FEATURE in client contact cron dynamic-page media product project project-template repository service; do
  rsync -av "${EXCLUDES[@]}" "$SRC/packages/features/$FEATURE/" "$DST/packages/features/$FEATURE/"
done
```

### 2) Repositories backend faltantes (`packages/infra/backend/repositories/src/*`)

```bash
for REPO in client client-address client-contact client-fiscal-data client-invoice client-log client-plan client-resource contact-submission dynamic-page product project project-template repository service statistics; do
  rsync -av "${EXCLUDES[@]}" "$SRC/packages/infra/backend/repositories/src/$REPO/" "$DST/packages/infra/backend/repositories/src/$REPO/"
done
```

### 3) Dominio (modelos y field configs)

```bash
rsync -av "${EXCLUDES[@]}" "$SRC/packages/domain/models/src/entities/" "$DST/packages/domain/models/src/entities/"
rsync -av "${EXCLUDES[@]}" "$SRC/packages/domain/fields/src/entities/" "$DST/packages/domain/fields/src/entities/"
```

### 4) Mensajes para backoffice/web

```bash
for LOCALE in en es ca; do
  rsync -av "${EXCLUDES[@]}" "$SRC/packages/messages/src/$LOCALE/" "$DST/packages/messages/src/$LOCALE/"
done

rsync -av "${EXCLUDES[@]}" "$SRC/packages/messages/src/types/" "$DST/packages/messages/src/types/"
```

### 5) Wiring de apps (copiado fino)

Copiar y adaptar manualmente:

- `apps/api/backoffice-bff/src/app.module.ts`
- `apps/api/web-bff/src/app.module.ts`
- `apps/api/backoffice-bff/package.json`
- `apps/api/web-bff/package.json`
- `apps/client/backoffice/package.json`
- `apps/client/web/package.json`
- `packages/infra/backend/repositories/package.json`
- `packages/infra/backend/repositories/src/index.ts`

## Orden recomendado de integracion

1. **Dominio primero**
   - `domain/models`, `domain/fields`, `messages`
2. **Infra de datos despues**
   - `infra/backend/repositories` (+ exports/package.json)
3. **Features backend**
   - `packages/features/{feature}/configuration`, `api`, `infra/backend`
4. **Wiring BFF**
   - `apps/api/*/app.module.ts` + dependencias package.json
5. **Client apps**
   - dependencias y vistas web/backoffice que consumen endpoints nuevos

## Puntos de adaptacion que suelen romper

### A) `TypeormModule`: dos estilos entre source y target

- Source usa `TypeormModule` directamente (modulo global ya configurado)
- Target usa `TypeormModule.forRoot()`

Decide un unico estilo y mantenlo consistente en ambos BFF.

Si copias `apps/api/*/src/app.module.ts` desde source tal cual, y en target sigues con `forRoot()`, ajusta esa llamada antes de compilar.

### B) `account` mock vs TypeORM real

- Target actual: `packages/infra/backend/repositories/src/account/schema.ts` + repo in-memory
- Source: `account/orm.entity.ts` + `@InjectRepository(...)` en repo

Si quieres parity con source, migra `account` completo al patron TypeORM y deja de depender de `schema.ts`.

### C) Exports de paquetes

Tras copiar carpetas, revisa:

- `packages/infra/backend/repositories/src/index.ts`
- `packages/infra/backend/repositories/package.json` (`exports`)
- `packages/domain/models/src/entities/index.ts`
- `packages/domain/fields/src/entities/index.ts`
- `packages/messages/src/*/index.ts`
- `packages/messages/src/types/index.ts`

### D) Dependencias workspace

Source introduce paquetes `@piar/*` nuevos. Si no actualizas `package.json` en apps y features, TypeScript fallara por imports no resueltos.

## Checklist de verificacion post-copia

```bash
pnpm install

pnpm --filter @piar/domain-models typecheck
pnpm --filter @piar/domain-fields typecheck
pnpm --filter @piar/messages typecheck

pnpm --filter @piar/infra-backend-repositories typecheck
pnpm --filter @piar/infra-backend-repositories build

pnpm --filter @piar/web-bff typecheck
pnpm --filter @piar/backoffice-bff typecheck

pnpm --filter @piar/web-bff build
pnpm --filter @piar/backoffice-bff build

pnpm --filter @piar/backoffice typecheck
pnpm --filter @piar/web typecheck
```

## Estrategia minima (si quieres ir incremental)

Si no quieres traer todo de golpe:

1. Trae solo `contact`:
   - `packages/features/contact/*`
   - `packages/infra/backend/repositories/src/contact-submission`
   - entidades y fields de `contact-submission`
   - wiring en backoffice/web BFF para `ContactSubmissionModule`
2. Luego `dynamic-page` + `service` para desbloquear web publica
3. Luego `client/project/repository/product` para backoffice completo

## Notas operativas

- No copies `dist/` ni `node_modules/`.
- Si aparece error de `tsconfig.base.json` en feature packages, revisa rutas `extends` por profundidad de carpeta.
- Si aparece error de lint por `eslint.config.mjs`, revisa el path relativo en cada package nuevo.
