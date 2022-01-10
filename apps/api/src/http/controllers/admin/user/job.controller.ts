import { Request, Response } from 'express';
import fs from 'fs-extra';
import { pick } from 'lodash';
import path from 'path';
import { Op, WhereOptions, Job, User, PaginateQuery } from '@intake24/db';
import { JobEntry, JobsResponse } from '@intake24/common/types/http/admin';
import { JobAttributes } from '@intake24/common/types/models';
import { NotFoundError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import type { Controller } from '@intake24/api/http/controllers';

export type AdminUserJobController = Controller<'browse' | 'read' | 'download'>;

export default ({ fsConfig }: Pick<IoC, 'fsConfig'>): AdminUserJobController => {
  const browse = async (
    req: Request<any, any, any, PaginateQuery & { type?: string }>,
    res: Response<JobsResponse>
  ): Promise<void> => {
    const user = req.user as User;
    const { type } = req.query;

    const where: WhereOptions<JobAttributes> = {
      userId: user.id,
      downloadUrlExpiresAt: { [Op.or]: [null, { [Op.gt]: new Date() }] },
    };

    if (type) where.type = type;

    const jobs = await Job.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      where,
      order: [['startedAt', 'DESC']],
    });

    res.json(jobs);
  };

  const read = async (req: Request, res: Response<JobEntry>): Promise<void> => {
    const { jobId: id } = req.params;
    const { id: userId } = req.user as User;

    const job = await Job.findOne({ where: { id, userId } });
    if (!job) throw new NotFoundError();

    res.json(job);
  };

  const download = async (req: Request, res: Response<Buffer>): Promise<void> => {
    const { jobId: id } = req.params;
    const { id: userId } = req.user as User;

    const job = await Job.findOne({
      where: {
        id,
        userId,
        downloadUrl: { [Op.ne]: null },
        downloadUrlExpiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!job?.downloadUrl) throw new NotFoundError();
    const { downloadUrl } = job;

    const file = path.resolve(fsConfig.local.downloads, downloadUrl);
    if (!(await fs.pathExists(file))) throw new NotFoundError();

    const { size } = await fs.stat(file);

    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=${downloadUrl}`);
    res.set('Content-Length', size.toString());
    fs.createReadStream(file).pipe(res);
  };

  return {
    browse,
    read,
    download,
  };
};
