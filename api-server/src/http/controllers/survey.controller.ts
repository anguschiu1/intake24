import { Request, Response, NextFunction } from 'express';
import Survey from '@/db/models/system/survey';
import SurveySubmission from '@/db/models/system/survey-submission';
import User from '@/db/models/system/user';
import NotFoundError from '@/http/errors/not-found.error';
import surveySvc from '@/services/user.service';

export default {
  async list(req: Request, res: Response): Promise<void> {
    const surveys = await Survey.scope('public').findAll();

    res.json(surveys);
  },

  async publicEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { surveyId } = req.params;
    const survey = await Survey.scope('public').findByPk(surveyId);

    if (!survey) {
      next(new NotFoundError());
      return;
    }

    res.json(survey);
  },

  async entry(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { surveyId } = req.params;
    const survey = await Survey.scope(['respodent', 'scheme']).findByPk(surveyId);

    if (!survey) {
      next(new NotFoundError());
      return;
    }

    res.json(survey);
  },

  // TODO: review for new frontend - include user data - submissions, feedback data etc for user's dashboard?
  async userInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { surveyId } = req.params;
    const { id: userId, name } = req.user as User;

    const survey = await Survey.findByPk(surveyId);
    const submissions = await SurveySubmission.count({ where: { surveyId, userId } });

    if (!survey) {
      next(new NotFoundError());
      return;
    }

    const userInfo = {
      userId,
      name,
      recallNumber: submissions + 1,
      redirectToFeedback: submissions >= survey.numberOfSubmissionsForFeedback,
    };

    res.json(userInfo);
  },

  async generateUser(req: Request, res: Response): Promise<void> {
    const { surveyId } = req.params;

    const {
      respondent: { userName },
      password,
    } = await surveySvc.generateRespondent(surveyId);

    res.json({ userName, password });
  },
};
