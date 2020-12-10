import { Router } from 'express';
import passport from 'passport';
import validation from '@/http/requests/foods';
import ioc from '@/ioc';
import { wrapAsync } from '@/util';

const { portionSizeController } = ioc.cradle;

const router = Router();

router.use(passport.authenticate('user', { session: false }));

router.get('/as-served', validation.portionSizeId, wrapAsync(portionSizeController.asServed));
router.get('/as-served/:id', wrapAsync(portionSizeController.asServedEntry));

router.get('/guide-image', validation.portionSizeId, wrapAsync(portionSizeController.guideImage));
router.get('/guide-image/:id', wrapAsync(portionSizeController.guideImageEntry));

router.get('/image-maps', validation.portionSizeId, wrapAsync(portionSizeController.imageMaps));
router.get('/image-maps/:id', wrapAsync(portionSizeController.imageMapsEntry));

router.get('/drinkware/:id', wrapAsync(portionSizeController.drinkwareEntry));

router.get('/weight', wrapAsync(portionSizeController.weight));

export default router;
