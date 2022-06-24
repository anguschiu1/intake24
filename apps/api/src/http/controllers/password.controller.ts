import type { Request, Response } from 'express';
import { Op, User, UserPasswordReset } from '@intake24/db';
import { ValidationError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import type { Controller } from './controller';

export type PasswordController = Controller<'request' | 'reset'>;

export default ({
  adminUserService,
  scheduler,
  securityConfig,
}: Pick<IoC, 'adminUserService' | 'securityConfig' | 'scheduler'>): PasswordController => {
  const request = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { email } = req.body;
    const userAgent = req.headers['user-agent'];

    await scheduler.jobs.addJob({ type: 'SendPasswordReset' }, { email, userAgent });

    res.json();
  };

  const reset = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { email, password, token } = req.body;

    const expiredAt = new Date(Date.now() - securityConfig.passwords.expiresIn);
    const op = User.sequelize?.getDialect() === 'postgres' ? Op.iLike : Op.eq;

    const passwordReset = await UserPasswordReset.findOne({
      where: { token, createdAt: { [Op.gt]: expiredAt } },
      include: [{ model: User, where: { email: { [op]: email } } }],
    });

    if (!passwordReset)
      throw new ValidationError(
        `It looks like this link is invalid / expired. Please check your email or request another link.`,
        { param: 'token' }
      );

    const { userId } = passwordReset;

    await Promise.all([adminUserService.updatePassword(userId, password), passwordReset.destroy()]);

    res.json();
  };

  return { request, reset };
};
