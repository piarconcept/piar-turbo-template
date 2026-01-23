# Error System - @piar/domain-models

Sistema de errores centralizado compartido entre frontend y backend.

## Características

- ✅ **Serializables**: Los errores pueden enviarse desde el backend al frontend via JSON
- ✅ **Type-safe**: Códigos de error tipados con TypeScript
- ✅ **HTTP status codes**: Mapeo automático a códigos HTTP
- ✅ **Detalles estructurados**: Incluye información adicional en formato JSON
- ✅ **Timestamp**: Cada error incluye marca de tiempo
- ✅ **Path tracking**: Opcional, para incluir la ruta de la petición

## Uso en Backend (NestJS)

### Lanzar errores

```typescript
import { 
  NotFoundError, 
  UnauthorizedError, 
  ValidationError 
} from '@piar/domain-models';

// Error simple
throw new NotFoundError('User', userId);

// Error con detalles
throw new ValidationError('Invalid form data', {
  email: ['Email is required', 'Email must be valid'],
  password: ['Password must be at least 8 characters'],
});

// Error de autenticación
throw new UnauthorizedError('Token has expired');
```

### Exception Filter (NestJS)

```typescript
import { 
  ExceptionFilter, 
  Catch, 
  ArgumentsHost, 
  HttpException 
} from '@nestjs/common';
import { ApplicationError } from '@piar/domain-models';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Si es un ApplicationError, serializarlo
    if (exception instanceof ApplicationError) {
      const errorResponse = {
        ...exception.toJSON(),
        path: request.url,
      };

      return response.status(exception.statusCode).json(errorResponse);
    }

    // Manejar otros errores...
  }
}
```

### Use Case con errores

```typescript
import { NotFoundError, ValidationError } from '@piar/domain-models';

export class GetUserUseCase {
  async execute(userId: string) {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const user = await this.repository.findById(userId);
    
    if (!user) {
      throw new NotFoundError('User', userId);
    }

    return user;
  }
}
```

## Uso en Frontend (React)

### Manejar errores de API

```typescript
import { ApplicationError, SerializableError } from '@piar/domain-models';

async function fetchUser(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      const errorData: SerializableError = await response.json();
      const error = ApplicationError.fromJSON(errorData);
      throw error;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApplicationError) {
      // Manejar error de la aplicación
      console.error('App error:', error.code, error.message);
      console.error('Details:', error.details);
      return null;
    }
    throw error;
  }
}
```

### Hook personalizado para errores

```typescript
import { useState } from 'react';
import { ApplicationError, SerializableError, ErrorCode } from '@piar/domain-models';

export function useApiError() {
  const [error, setError] = useState<ApplicationError | null>(null);

  const handleError = (error: unknown) => {
    if (error instanceof ApplicationError) {
      setError(error);
      return;
    }

    // Si es una respuesta HTTP con error serializado
    if (error && typeof error === 'object' && 'code' in error) {
      const appError = ApplicationError.fromJSON(error as SerializableError);
      setError(appError);
      return;
    }

    // Error desconocido
    setError(ApplicationError.fromError(error));
  };

  const clearError = () => setError(null);

  const isAuthError = error?.code === ErrorCode.UNAUTHORIZED || 
                      error?.code === ErrorCode.TOKEN_EXPIRED;

  return { error, handleError, clearError, isAuthError };
}
```

### Componente de error

```typescript
import { ApplicationError, ErrorCode } from '@piar/domain-models';

interface ErrorMessageProps {
  error: ApplicationError;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const getErrorMessage = () => {
    switch (error.code) {
      case ErrorCode.NOT_FOUND:
        return 'The requested resource was not found';
      case ErrorCode.UNAUTHORIZED:
        return 'Please login to continue';
      case ErrorCode.VALIDATION_ERROR:
        return error.message || 'Validation failed';
      default:
        return 'An unexpected error occurred';
    }
  };

  return (
    <div className="error-message">
      <h3>{getErrorMessage()}</h3>
      {error.details && (
        <pre>{JSON.stringify(error.details, null, 2)}</pre>
      )}
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  );
}
```

## Códigos de Error Disponibles

### General (1000-1999)
- `UNKNOWN_ERROR` - Error desconocido (500)
- `INTERNAL_SERVER_ERROR` - Error interno del servidor (500)
- `BAD_REQUEST` - Petición incorrecta (400)
- `VALIDATION_ERROR` - Error de validación (400)

### Autenticación (2000-2999)
- `UNAUTHORIZED` - No autorizado (401)
- `FORBIDDEN` - Prohibido (403)
- `INVALID_CREDENTIALS` - Credenciales inválidas (401)
- `TOKEN_EXPIRED` - Token expirado (401)
- `TOKEN_INVALID` - Token inválido (401)
- `SESSION_EXPIRED` - Sesión expirada (401)

### Recursos (3000-3999)
- `NOT_FOUND` - No encontrado (404)
- `RESOURCE_NOT_FOUND` - Recurso no encontrado (404)
- `RESOURCE_ALREADY_EXISTS` - Recurso ya existe (409)
- `DUPLICATE_ENTRY` - Entrada duplicada (409)

### Lógica de Negocio (4000-4999)
- `BUSINESS_RULE_VIOLATION` - Violación de regla de negocio (422)
- `INSUFFICIENT_PERMISSIONS` - Permisos insuficientes (403)
- `OPERATION_NOT_ALLOWED` - Operación no permitida (403)

### Servicios Externos (5000-5999)
- `EXTERNAL_SERVICE_ERROR` - Error de servicio externo (502)
- `THIRD_PARTY_API_ERROR` - Error de API externa (502)
- `DATABASE_ERROR` - Error de base de datos (500)
- `NETWORK_ERROR` - Error de red (503)

## Clases de Error Específicas

- `UnauthorizedError` - No autorizado
- `InvalidCredentialsError` - Credenciales inválidas
- `TokenExpiredError` - Token expirado
- `ForbiddenError` - Prohibido
- `NotFoundError` - Recurso no encontrado
- `ResourceAlreadyExistsError` - Recurso ya existe
- `ValidationError` - Error de validación
- `BusinessRuleViolationError` - Violación de regla de negocio
- `ExternalServiceError` - Error de servicio externo
- `DatabaseError` - Error de base de datos

## Ejemplo Completo: Login

### Backend (Use Case)

```typescript
import { InvalidCredentialsError, ValidationError } from '@piar/domain-models';

export class LoginUseCase {
  async execute(email: string, password: string) {
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const user = await this.repository.findByEmail(email);
    
    if (!user || user.password !== password) {
      throw new InvalidCredentialsError();
    }

    return { token: 'jwt-token', user };
  }
}
```

### Frontend (React Hook)

```typescript
import { ApplicationError, ErrorCode } from '@piar/domain-models';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApplicationError | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw ApplicationError.fromJSON(errorData);
      }

      return await response.json();
    } catch (err) {
      const appError = err instanceof ApplicationError 
        ? err 
        : ApplicationError.fromError(err);
      
      setError(appError);
      throw appError;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
```

## Ventajas

1. **Consistencia**: Misma estructura de error en backend y frontend
2. **Type-safety**: TypeScript valida códigos y tipos
3. **Debugging**: Fácil identificar errores con códigos únicos
4. **i18n friendly**: Los códigos pueden mapearse a traducciones
5. **Logging**: Estructura consistente para logs
6. **Testing**: Fácil de mockear y testear
7. **API Documentation**: Documentar errores posibles por endpoint

## Testing

```bash
# Ejecutar tests
pnpm --filter @piar/domain-models test

# Con coverage
pnpm --filter @piar/domain-models test:coverage
```
