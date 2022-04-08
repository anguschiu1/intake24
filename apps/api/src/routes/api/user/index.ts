import { Router } from 'express';
import { authenticate } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/user';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';
import feedback from './feedback';
import physicalData from './physical-data';
import submissions from './submissions';

export default () => {
  const { userProfileController } = ioc.cradle;

  const router = Router();

  authenticate(router, 'user');

  router.post(
    '/password',
    validation.updatePassword,
    wrapAsync(userProfileController.updatePassword)
  );

  router.use('/feedback', feedback());
  router.use('/physical-data', physicalData());
  router.use('/submissions', submissions());

  return router;
};
