import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from '../types/jwt-payload';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  verify(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token);
  }
}
