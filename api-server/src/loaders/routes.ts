import errors from '@/http/middleware/errors';
import routes from '@/routes';
import authentication from './authentication';
import { AppLoader } from './loader';

export default async ({ app }: AppLoader): Promise<void> => {
  // Mount authentication middleware
  authentication({ app });

  // Mount routes
  routes({ app });

  // Mount error middleware
  errors({ app });
};
