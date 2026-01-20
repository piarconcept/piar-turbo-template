# @piar/layout

Componentes de layout compartidos para todas las aplicaciones piar.

## Componentes

- **Layout**: Componente principal que envuelve toda la aplicación con Header y Footer
- **Header**: Barra de navegación superior con logo y menú
- **Footer**: Pie de página con información de contacto y enlaces
- **Navigation**: Componente de navegación reutilizable

## Uso

```tsx
import { Layout } from '@piar/layout';

export default function RootLayout({ children }) {
  return (
    <Layout language="ca">
      {children}
    </Layout>
  );
}
```
