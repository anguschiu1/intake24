import type { Request, Response } from 'express';
import type {
  NutrientTableInput,
  NutrientTableEntry,
  NutrientTableRefs,
  NutrientTablesResponse,
  NutrientTableRecordsResponse,
  JobEntry,
} from '@intake24/common/types/http/admin';
import type { User, PaginateQuery } from '@intake24/db';
import { NutrientTableRecord, FoodsNutrientType, NutrientTable } from '@intake24/db';
import type { IoC } from '@intake24/api/ioc';
import { ValidationError } from '@intake24/api/http/errors';
import { pick } from 'lodash';
import type { Controller, CrudActions } from '../controller';

export type NutrientTableController = Controller<CrudActions | 'upload' | 'records'>;

export default ({
  nutrientTableService,
}: Pick<IoC, 'nutrientTableService'>): NutrientTableController => {
  const entry = async (
    req: Request<{ nutrientTableId: string }>,
    res: Response<NutrientTableEntry>
  ): Promise<void> => {
    const { nutrientTableId } = req.params;

    const nutrientTable = await nutrientTableService.getTable(nutrientTableId);

    res.json(nutrientTable);
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<NutrientTablesResponse>
  ): Promise<void> => {
    const nutrientTables = await NutrientTable.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'description'],
      order: [['id', 'ASC']],
    });

    res.json(nutrientTables);
  };

  const store = async (
    req: Request<any, any, NutrientTableInput>,
    res: Response<NutrientTableEntry>
  ): Promise<void> => {
    const nutrientTable = await nutrientTableService.createTable(req.body);

    res.status(201).json(nutrientTable);
  };

  const read = async (
    req: Request<{ nutrientTableId: string }>,
    res: Response<NutrientTableEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ nutrientTableId: string }>,
    res: Response<NutrientTableEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ nutrientTableId: string }, any, NutrientTableInput>,
    res: Response<NutrientTableEntry>
  ): Promise<void> => {
    const { nutrientTableId } = req.params;

    const nutrientTable = await nutrientTableService.updateTable(nutrientTableId, req.body);

    res.json(nutrientTable);
  };

  const destroy = async (
    req: Request<{ nutrientTableId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { nutrientTableId } = req.params;

    await nutrientTableService.deleteTable(nutrientTableId);

    res.status(204).json();
  };

  const refs = async (req: Request, res: Response<NutrientTableRefs>): Promise<void> => {
    const nutrientTypes = await FoodsNutrientType.scope('list').findAll();

    res.json({ nutrientTypes });
  };

  const upload = async (
    req: Request<{ nutrientTableId: string }>,
    res: Response<JobEntry>
  ): Promise<void> => {
    const {
      file,
      params: { nutrientTableId },
      body: { type },
    } = req;
    const { id: userId } = req.user as User;

    if (!file) throw new ValidationError('Missing file.', { param: 'file' });

    const job = await nutrientTableService.uploadCsvFile(nutrientTableId, {
      type,
      file: file.path,
      userId,
    });

    res.json(job);
  };

  const records = async (
    req: Request<{ nutrientTableId: string }, any, any, PaginateQuery>,
    res: Response<NutrientTableRecordsResponse>
  ): Promise<void> => {
    const {
      params: { nutrientTableId },
    } = req;

    const nutrientTableRecords = await NutrientTableRecord.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name', 'localName'],
      where: { nutrientTableId },
      order: [['id', 'ASC']],
    });

    res.json(nutrientTableRecords);
  };

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
    refs,
    upload,
    records,
  };
};
