import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import { NotFoundError } from '@intake24/api/http/errors';
import { InvalidIdError } from '@intake24/api/services/foods';

const foodController = ({
  foodDataService,
  imagesBaseUrl,
  cachedParentCategoriesService,
}: Pick<IoC, 'foodDataService' | 'imagesBaseUrl' | 'cachedParentCategoriesService'>) => {
  const entry = async (req: Request, res: Response): Promise<void> => {
    const { code, localeId } = req.params;

    try {
      const response = await foodDataService.getFoodData(localeId, code);

      for (let i = 0; i < response.portionSizeMethods.length; ++i) {
        response.portionSizeMethods[i].imageUrl =
          `${imagesBaseUrl}/${response.portionSizeMethods[i].imageUrl}`;
      }

      res.json(response);
    } catch (err) {
      if (err instanceof InvalidIdError) throw new NotFoundError(err.message);
      throw err;
    }
  };

  const categories = async (req: Request, res: Response): Promise<void> => {
    const categories = await cachedParentCategoriesService.getFoodAllCategories(req.params.code);

    res.json({
      categories,
    });
  };

  /* const entryWithSource = async (req: Request, res: Response): Promise<void> => {
    const { code, localeId } = req.params;
    res.json();
  };

  const brands = async (req: Request, res: Response): Promise<void> => {
    const { code, localeId } = req.params;
    res.json();
  };

  const associatedFoods = async (req: Request, res: Response): Promise<void> => {
    const { code, localeId } = req.params;
    res.json();
  };

  const composition = async (req: Request, res: Response): Promise<void> => {
    const { code, localeId } = req.params;
    res.json();
  }; */

  return {
    entry,
    categories,
    /* entryWithSource,
    brands,
    associatedFoods,
    composition, */
  };
};

export default foodController;

export type FoodController = ReturnType<typeof foodController>;
