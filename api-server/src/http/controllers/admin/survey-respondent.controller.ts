import { Request, Response, NextFunction } from 'express';
import { pick } from 'lodash';
import { RespondentResponse } from '@common/types/api/admin/users';
import Survey from '@/db/models/system/survey';
import UserSurveyAlias from '@/db/models/system/user-survey-alias';
import NotFoundError from '@/http/errors/not-found.error';
import userRespondentResponse from '@/http/responses/admin/user-respondent.response';
import userSvc from '@/services/user.service';

export default {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const survey = await Survey.findByPk(id);

    if (!survey) {
      next(new NotFoundError());
      return;
    }

    const respondents = await UserSurveyAlias.scope('user').paginate<RespondentResponse>({
      req,
      columns: ['userName'],
      where: { surveyId: id },
      transform: userRespondentResponse,
    });

    res.json(respondents);
  },

  async store(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const { respondent } = await userSvc.createRespondent(
      id,
      pick(req.body, ['name', 'email', 'phone', 'userName', 'password'])
    );

    res.status(201).json({ data: respondent });
  },

  async update(req: Request, res: Response): Promise<void> {
    const { id, userId } = req.params;

    console.log('id', id);
    console.log('userId', userId);

    const respondent = await userSvc.updateRespondent(
      id,
      userId,
      pick(req.body, ['name', 'email', 'phone', 'userName', 'password'])
    );

    res.json({ data: respondent });
  },

  async delete(req: Request, res: Response): Promise<void> {
    const { id, userId } = req.params;

    await userSvc.deleteRespondent(id, userId);
    res.status(204).json();
  },
};
