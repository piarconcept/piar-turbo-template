# Domain: Dynamic Form

This template includes a generic, domain-level contract for metadata-driven forms.

Packages:

- `@piar/domain-dynamic-form` — domain contracts, types and helpers
- `@piar/infra-client-dynamic-form` — React renderer + field components

## Goals

- Keep the **domain contract** UI-agnostic
- Keep the **renderer** generic and reusable across apps
- Avoid business entities/fields — use example metadata only

## Basic usage (client)

```ts
import { DynamicForm } from '@piar/infra-client-dynamic-form';
import { FieldType, type EntityFieldsConfig } from '@piar/domain-fields';

const config: EntityFieldsConfig<{ name: string }> = {
  entityName: 'example',
  fields: [
    {
      key: 'name',
      type: FieldType.Text,
      label: 'Name',
      required: true,
    },
  ],
};

<DynamicForm
  config={config}
  mode="create"
  onSubmit={async (values) => {
    console.log(values);
  }}
/>
```

## Notes

- Validation is intentionally minimal (required fields + optional per-field rules).
- Real backends should store metadata in a DB and deliver it to the client.
- `DynamicCrudPort.list(query)` is required for collection reads and must be
  implemented as a bounded persistence query when backed by a database.
- Avoid whole-collection reads for dynamic tables; pagination, search, filters,
  and sorting belong at the repository boundary.

## Last Updated

8 May 2026 - Documented bounded list contract requirements for dynamic CRUD ports.
