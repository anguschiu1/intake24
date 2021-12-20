import { Router } from 'express';
import multer from 'multer';
import { permission } from '@api/http/middleware/acl';
import validation from '@api/http/requests/admin/images/maps';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';

const { fsConfig, imageMapController } = ioc.cradle;
const router = Router();
const upload = multer({ dest: fsConfig.local.uploads });

router
  .route('')
  .post(
    permission('image-maps-create'),
    upload.single('baseImage'),
    validation.store,
    wrapAsync(imageMapController.store)
  )
  .get(permission('image-maps-browse'), validation.browse, wrapAsync(imageMapController.browse));

router
  .route('/:imageMapId')
  .get(permission('image-maps-read'), wrapAsync(imageMapController.read))
  .put(permission('image-maps-edit'), validation.update, wrapAsync(imageMapController.update))
  .delete(permission('image-maps-delete'), wrapAsync(imageMapController.destroy));

router.get('/:imageMapId/edit', permission('image-maps-edit'), wrapAsync(imageMapController.edit));

export default router;
