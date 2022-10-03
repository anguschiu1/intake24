import { Router } from 'express';

import { permission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/fdbs/categories';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { adminCategoryController } = ioc.cradle;
  const router = Router({ mergeParams: true });

  router
    .route('')
    .post(permission('fdbs|create'), wrapAsync(adminCategoryController.store))
    .get(validation.browse, wrapAsync(adminCategoryController.browse));

  router.get('/root', wrapAsync(adminCategoryController.root));

  router
    .route('/:categoryId')
    .get(wrapAsync(adminCategoryController.read))
    .put(validation.update, wrapAsync(adminCategoryController.update))
    .delete(wrapAsync(adminCategoryController.destroy));

  router.get('/:categoryId/contents', wrapAsync(adminCategoryController.contents));

  return router;
};
