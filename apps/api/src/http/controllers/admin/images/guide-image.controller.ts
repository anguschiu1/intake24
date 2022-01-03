import { Request, Response } from 'express';
import { pick } from 'lodash';
import {
  GuideImageEntry,
  GuideImageRefs,
  GuideImageListEntry,
  GuideImagesResponse,
} from '@common/types/http/admin';
import { NotFoundError } from '@api/http/errors';
import type { IoC } from '@api/ioc';
import { GuideImage, ImageMap, PaginateQuery } from '@api/db';
import imagesResponseCollection from '@api/http/responses/admin/images';
import { Controller, CrudActions } from '../../controller';

export type GuideImageController = Controller<CrudActions>;

export default ({
  imagesBaseUrl,
  guideImageService,
  portionSizeService,
}: Pick<
  IoC,
  'imagesBaseUrl' | 'guideImageService' | 'portionSizeService'
>): GuideImageController => {
  const responseCollection = imagesResponseCollection(imagesBaseUrl);

  const entry = async (
    req: Request<{ guideImageId: string }>,
    res: Response<GuideImageEntry>
  ): Promise<void> => {
    const { guideImageId } = req.params;

    const guideImage = await portionSizeService.getGuideImage(guideImageId);
    if (!guideImage) throw new NotFoundError();

    res.json(responseCollection.guideEntryResponse(guideImage));
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<GuideImagesResponse>
  ): Promise<void> => {
    const guideImages = await GuideImage.paginate<GuideImageListEntry>({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'description'],
      order: [['id', 'ASC']],
      include: ['selectionImage'],
      transform: responseCollection.guideListResponse,
    });

    res.json(guideImages);
  };

  const store = async (req: Request, res: Response<GuideImageEntry>): Promise<void> => {
    const { id, description, imageMapId } = req.body;

    await guideImageService.create({ id, description, imageMapId });

    const guideImage = await portionSizeService.getGuideImage(id);
    if (!guideImage) throw new NotFoundError();

    res.status(201).json(responseCollection.guideEntryResponse(guideImage));
  };

  const read = async (
    req: Request<{ guideImageId: string }>,
    res: Response<GuideImageEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ guideImageId: string }>,
    res: Response<GuideImageEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ guideImageId: string }>,
    res: Response<GuideImageEntry>
  ): Promise<void> => {
    const { guideImageId } = req.params;
    const { description, objects } = req.body;

    const guideImage = await guideImageService.update(guideImageId, {
      description,
      objects,
    });

    res.json(responseCollection.guideEntryResponse(guideImage));
  };

  const destroy = async (
    req: Request<{ guideImageId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { guideImageId } = req.params;

    await guideImageService.destroy(guideImageId);

    res.status(204).json();
  };

  const refs = async (req: Request, res: Response<GuideImageRefs>): Promise<void> => {
    const imageMaps = await ImageMap.findAll({
      attributes: ['id', 'description'],
      order: [['id', 'ASC']],
    });

    res.json({ imageMaps: imageMaps.map(({ id, description }) => ({ id, description })) });
  };

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
    refs,
  };
};
