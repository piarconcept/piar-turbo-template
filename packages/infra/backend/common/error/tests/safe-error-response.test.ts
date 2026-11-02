import { describe, expect, it } from 'vitest';
import { InternalServerError, ResourceAlreadyExistsError } from '@piar/domain-models';
import { serializeApplicationError, serializeHttpError } from '../src/filters/safe-error-response';

describe('safe error responses', () => {
  it('removes identifiers and original details from application errors', () => {
    const response = serializeApplicationError(
      new ResourceAlreadyExistsError('Email', 'person@example.com', 'email_exists'),
      'event-1',
    );

    expect(response).toMatchObject({
      message: 'Resource already exists',
      details: { eventId: 'event-1' },
      i18nKey: 'email_exists',
    });
    expect(JSON.stringify(response)).not.toContain('person@example.com');
  });

  it('does not expose an unexpected exception message', () => {
    const response = serializeApplicationError(
      new InternalServerError('database password leaked in exception'),
      'event-2',
    );

    expect(response.message).toBe('Internal server error');
    expect(JSON.stringify(response)).not.toContain('database password');
  });

  it('maps server-side HTTP errors to a generic response', () => {
    expect(serializeHttpError(503, 'event-3')).toMatchObject({
      message: 'Internal server error',
      statusCode: 503,
      details: { eventId: 'event-3' },
    });
  });
});
