import type { IoC } from '@intake24/api/ioc';
import type { CategoryContents, CategoryHeader, CategorySearch } from '@intake24/common/types/http';
import type { FindOptions, FoodLocalAttributes, PaginateQuery } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import {
  Category,
  FoodCategory,
  FoodLocal,
  FoodsLocale as Locale,
  getAllChildCategories,
  Op,
  QueryTypes,
} from '@intake24/db';

const categoryContentsService = ({
  adminCategoryService,
  db,
}: Pick<IoC, 'db' | 'adminCategoryService'>) => {
  const filterUndefined = (
    headers: { code: string; description: string | undefined }[]
  ): { code: string; description: string }[] =>
    headers
      .filter((h) => h.description !== undefined)
      .map((h) => ({ code: h.code, description: h.description! }));

  const getLocaleInfo = async (localeId: string): Promise<Locale> => {
    const locale = await Locale.findOne({
      where: { id: localeId },
      attributes: ['prototypeLocaleId'],
    });

    if (!locale) throw new NotFoundError(`Locale ${localeId} not found`);

    return locale;
  };

  const getRootCategories = async (localeId: string): Promise<CategoryContents> => {
    const categories = await adminCategoryService.getRootCategories(localeId);

    return {
      header: { code: '', description: 'Root' },
      foods: [],
      subcategories: categories
        .filter(({ isHidden }) => !isHidden)
        .map(({ code, name }) => ({ code, description: name })),
    };
  };

  const getCategoryHeader = async (
    localeId: string,
    prototypeLocaleId: string | null,
    categoryCode: string
  ): Promise<CategoryHeader> => {
    const category = await Category.findOne({
      where: { code: categoryCode },
      attributes: ['code'],
      include: [
        {
          association: 'locals',
          where: { localeId },
          required: false,
        },
        {
          association: 'prototypeLocals',
          where: { localeId: prototypeLocaleId },
          required: false,
        },
      ],
    });

    if (category === null) {
      throw new NotFoundError(`Category ${categoryCode} not found`);
    }

    return {
      code: categoryCode,
      description:
        category.locals?.[0].name ?? category.prototypeLocals?.[0].name ?? '# Description missing!',
    };
  };

  const getCategoryContents = async (
    localeId: string,
    categoryCode: string
  ): Promise<CategoryContents> => {
    /*
        v3 implementation
  
        SELECT code, description, coalesce(fl.local_description, flp.local_description) as local_description
          FROM foods_categories
             INNER JOIN foods_local_lists ON foods_categories.food_code = foods_local_lists.food_code AND foods_local_lists.locale_id = {locale_id}
             LEFT JOIN foods ON foods.code = foods_local_lists.food_code
             LEFT JOIN foods_local as fl ON fl.food_code = foods_local_lists.food_code AND fl.locale_id = {locale_id}
             LEFT JOIN foods_local as flp ON flp.food_code = foods_local_lists.food_code AND flp.locale_id IN
                                                                                             (SELECT prototype_locale_id AS l FROM locales WHERE id = {locale_id})
       WHERE foods_categories.category_code = {category_code} AND coalesce(fl.local_description, flp.local_description) IS NOT NULL
       ORDER BY coalesce(fl.local_description, flp.local_description)
       LIMIT 30 */

    const locale = await getLocaleInfo(localeId);

    const { prototypeLocaleId } = locale;

    const header = await getCategoryHeader(localeId, prototypeLocaleId, categoryCode);

    const category = await Category.findOne({
      where: { code: categoryCode },
      attributes: ['code'],
      include: [
        {
          association: 'subCategories',
          required: true,
          attributes: ['code'],
          include: [
            { association: 'locals', where: { localeId }, required: false },
            {
              association: 'prototypeLocals',
              where: { localeId: prototypeLocaleId },
              required: false,
            },
          ],
        },
      ],
    });

    const foods = await FoodCategory.findAll({
      where: { categoryCode },
      include: [
        {
          association: 'food',
          required: true,
          include: [
            {
              association: 'locales',
              attributes: [],
              where: { id: localeId },
              required: true,
            },
            {
              association: 'locals',
              where: { localeId },
              required: false,
            },
            {
              association: 'prototypeLocals',
              where: { localeId: prototypeLocaleId },
              required: false,
            },
          ],
        },
      ],
    });

    const foodHeaders = foods.map((row) => {
      const description = row.food?.locals?.[0].name ?? row.food?.prototypeLocals?.[0].name;

      return { code: row.foodCode, description };
    });

    const categoryHeaders = (category?.subCategories ?? []).map((row) => {
      const description = row.locals?.[0].name ?? row.prototypeLocals?.[0].name;

      return { code: row.code, description };
    });

    return {
      header,
      foods: filterUndefined(foodHeaders).sort((a, b) =>
        a.description.localeCompare(b.description)
      ),
      subcategories: filterUndefined(categoryHeaders).sort((a, b) =>
        a.description.localeCompare(b.description)
      ),
    };
  };

  const searchCategory = async (
    localeId: string,
    category: string,
    query: PaginateQuery
  ): Promise<CategorySearch> => {
    const categories = await db.foods.query<{ code: string }>(getAllChildCategories, {
      type: QueryTypes.SELECT,
      replacements: { category },
      plain: false,
      raw: true,
    });

    const options: FindOptions<FoodLocalAttributes> = {
      attributes: ['foodCode', 'name'],
      where: { localeId },
      include: [
        {
          association: 'main',
          attributes: ['code'],
          required: true,
          include: [
            {
              attributes: ['categoryCode'],
              association: 'parentCategoryMappings',
              where: { categoryCode: categories.map(({ code }) => code) },
            },
          ],
        },
      ],
      order: [['name', 'ASC']],
    };
    const { search } = query;

    if (search) {
      const op =
        FoodLocal.sequelize?.getDialect() === 'postgres'
          ? { [Op.iLike]: `%${search}%` }
          : { [Op.substring]: search };

      const ops = ['name'].map((column) => ({ [column]: op }));

      options.where = { ...options.where, [Op.or]: ops };
    }

    return FoodLocal.paginate({
      query,
      ...options,
      transform: (food) => ({ code: food.foodCode, description: food.name }),
    });
  };

  return {
    getCategoryContents,
    getRootCategories,
    searchCategory,
  };
};

export default categoryContentsService;

export type CategoryContentsService = ReturnType<typeof categoryContentsService>;
