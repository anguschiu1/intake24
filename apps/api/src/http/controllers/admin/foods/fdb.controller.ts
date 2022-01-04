import { Request, Response } from 'express';
import { pick } from 'lodash';
import { PaginateQuery, FoodsLocale, SystemLocale } from '@intake24/db';
import { LocaleEntry, LocalesResponse } from '@common/types/http/admin';
import { WhereOptions } from 'sequelize/types';
import { LocaleAttributes } from '@common/types/models';
import { foodDatabaseMaintainerPrefix, foodsAdmin } from '@api/services';
import { NotFoundError } from '@api/http/errors';
import type { Controller, CrudActions } from '../../controller';

export type AdminFoodDatabaseController = Controller<Extract<CrudActions, 'browse' | 'read'>>;

export default (): AdminFoodDatabaseController => {
  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<LocalesResponse>
  ): Promise<void> => {
    const permissions = (await req.scope.cradle.aclService.getPermissions()).map(
      ({ name }) => name
    );

    const where: WhereOptions<LocaleAttributes> = {};
    if (!permissions.includes(foodsAdmin)) {
      const fdbs = permissions
        .filter((permission) => permission.startsWith(foodDatabaseMaintainerPrefix))
        .map((permission) => permission.replace(foodDatabaseMaintainerPrefix, ''));

      where.id = fdbs;
    }

    const locales = await SystemLocale.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'englishName', 'localName'],
      order: [['id', 'ASC']],
    });

    res.json(locales);
  };

  const read = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleEntry>
  ): Promise<void> => {
    const { localeId } = req.params;

    const [systemLocale, foodsLocale] = await Promise.all([
      SystemLocale.findByPk(localeId),
      FoodsLocale.findByPk(localeId),
    ]);
    if (!systemLocale || !foodsLocale) throw new NotFoundError();

    res.json(systemLocale);
  };

  return { browse, read };
};
