import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';

export interface TokenRequest extends Request {
  userId: number;
}

@Injectable()
export class TokenVerificationMiddleware implements NestMiddleware {
  use(req: TokenRequest, res: Response, next: NextFunction) {
    try {
      const token = req.header('auth-token');
      if (!token) return res.status(400).json('token not provided');

      const decoded = jwt.verify(token, process.env.SECRET || '');
      req.userId = (decoded as {id: number}).id;

      next();
    } catch (error) {
      return res.status(403).json('invalid token');
    }
  }
}
