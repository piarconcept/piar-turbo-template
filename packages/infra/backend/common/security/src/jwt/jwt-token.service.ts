import { Injectable } from '@nestjs/common';
import type { JwtSignOptions } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from '../types/jwt-payload';

type JwtSignOptionsLike = {
  expiresIn?: string | number;
};

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: JwtPayload, options?: JwtSignOptionsLike): string {
    return this.jwtService.sign(payload, options as JwtSignOptions);
  }

  verify(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token);
  }
}
