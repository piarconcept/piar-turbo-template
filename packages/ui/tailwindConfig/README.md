# @piar/tailwind-config

Configuración compartida de Tailwind CSS para todas las aplicaciones piar.

## Uso

```typescript
import type { Config } from "tailwindcss";
import { baseConfig } from "@piar/tailwind-config";

const config: Config = {
  ...baseConfig,
  // Añade customizaciones específicas de tu app aquí si es necesario
};

export default config;
```

## Características

- Colores primarios (orange, blue)
- Tipografía Montserrat
- Configuración de typography plugin
- Variables CSS customizables
