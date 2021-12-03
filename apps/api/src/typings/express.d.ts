import type { AwilixContainer } from 'awilix';
import type { IoC } from '@api/ioc';

declare global {
  namespace Express {
    export interface Request {
      scope: AwilixContainer<IoC>;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    duo: {
      state: string;
      email: string;
    };
  }
}
