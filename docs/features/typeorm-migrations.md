# TypeORM migrations

This template uses TypeORM with migrations.

Key package:

- `@piar/infra-backend-common-typeorm`

## Environment

Set `DATABASE_URL`:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/piar
```

## Notes

- `synchronize` is disabled by default.
- Migrations should be the only way schema changes are applied.

## TODO

- Add dedicated scripts for generating/running migrations (per app or per package) once the DB-backed repositories are implemented.
