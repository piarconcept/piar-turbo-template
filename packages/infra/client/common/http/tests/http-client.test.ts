import { beforeEach, describe, expect, it, vi } from 'vitest';

const { create } = vi.hoisted(() => ({ create: vi.fn() }));

vi.mock('axios', () => ({
  default: { create },
}));

import { HttpClient } from '../src/http-client';

function axiosInstance() {
  return {
    defaults: { headers: { common: {} } },
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };
}

describe('HttpClient secure defaults', () => {
  beforeEach(() => {
    create.mockReset();
    create.mockReturnValue(axiosInstance());
  });

  it('does not send browser credentials unless explicitly requested', () => {
    new HttpClient('https://api.example.com');

    expect(create).toHaveBeenCalledWith(expect.objectContaining({ withCredentials: false }));
  });

  it('allows an explicit cookie-based integration to opt in', () => {
    new HttpClient({ baseUrl: 'https://api.example.com', withCredentials: true });

    expect(create).toHaveBeenCalledWith(expect.objectContaining({ withCredentials: true }));
  });
});
