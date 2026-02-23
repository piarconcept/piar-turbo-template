export interface JwtPayload {
  accountId: string;
  email?: string;
  role?: string;
  tokenType?: 'access' | 'refresh';
}
