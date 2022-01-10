import { Router } from 'express';
import validation from '@intake24/api/http/requests/authentication';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

const { authenticationController } = ioc.cradle;

const router = Router();

router.post('/login', validation.emailLogin, wrapAsync(authenticationController.emailLogin));
router.post('/login/alias', validation.aliasLogin, wrapAsync(authenticationController.aliasLogin));
router.post('/login/token', wrapAsync(authenticationController.tokenLogin));
router.post('/login/verify', validation.mfaVerify, wrapAsync(authenticationController.verify));
router.post('/refresh', wrapAsync(authenticationController.refresh));
router.post('/logout', wrapAsync(authenticationController.logout));

export default router;
