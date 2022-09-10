import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type {
  SurveyEntryResponse,
  SurveyFollowUpResponse,
  SurveyRequestHelpInput,
  SurveyUserInfoResponse,
  SurveyUserSessionResponse,
} from '@intake24/common/types/http';
import type { User } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { flattenSchemeWithSection, isMealSection } from '@intake24/common/schemes';
import { merge } from '@intake24/common/util';
import { Survey } from '@intake24/db';

const surveyRespondentController = ({
  surveyService,
  surveySubmissionService,
}: Pick<IoC, 'surveyService' | 'surveySubmissionService'>) => {
  const parameters = async (
    req: Request<{ slug: string }>,
    res: Response<SurveyEntryResponse>
  ): Promise<void> => {
    const { slug } = req.params;

    const survey = await Survey.findOne({
      where: { slug },
      include: [{ association: 'surveyScheme' }, { association: 'feedbackScheme' }],
    });
    if (!survey || !survey.surveyScheme) throw new NotFoundError();

    const {
      id,
      name,
      state,
      localeId,
      surveyScheme,
      feedbackScheme,
      numberOfSubmissionsForFeedback,
      storeUserSessionOnServer,
      suspensionReason,
      surveySchemeOverrides,
    } = survey;

    let { meals } = surveyScheme;
    const { questions } = surveyScheme;

    // Merge survey's scheme overrides
    // 1) Meals - override whole list
    if (surveySchemeOverrides.meals.length) meals = [...surveySchemeOverrides.meals];

    // 2) Questions - merge by Question ID
    if (surveySchemeOverrides.questions.length) {
      const flattenScheme = flattenSchemeWithSection(surveyScheme.questions);
      for (const question of surveySchemeOverrides.questions) {
        const match = flattenScheme.find((item) => item.id === question.id);
        if (!match) continue;

        const { section } = match;

        if (isMealSection(section)) {
          const index = questions.meals[section].findIndex((item) => item.id === question.id);
          if (index !== -1) questions.meals[section].splice(index, 1, merge(match, question));
        } else {
          const index = questions[section].findIndex((item) => item.id === question.id);
          if (index !== -1) questions[section].splice(index, 1, merge(match, question));
        }
      }
    }

    res.json({
      id,
      slug,
      name,
      state,
      localeId,
      surveyScheme: { id: surveyScheme.id, type: surveyScheme.type, meals, questions },
      feedbackScheme,
      numberOfSubmissionsForFeedback,
      storeUserSessionOnServer,
      suspensionReason,
    });
  };

  const userInfo = async (
    req: Request<{ slug: string }, any, any, { tzOffset: number }>,
    res: Response<SurveyUserInfoResponse>
  ): Promise<void> => {
    const {
      params: { slug },
      query: { tzOffset },
    } = req;
    const user = req.user as User;

    const userResponse = await surveyService.userInfo(slug, user, tzOffset);

    res.json(userResponse);
  };

  const getSession = async (
    req: Request<{ slug: string }>,
    res: Response<SurveyUserSessionResponse>
  ): Promise<void> => {
    const { id: userId } = req.user as User;
    const { slug } = req.params;

    const session = await surveyService.getSession(slug, userId);

    res.json(session);
  };

  const setSession = async (
    req: Request<{ slug: string }>,
    res: Response<SurveyUserSessionResponse>
  ): Promise<void> => {
    const { id: userId } = req.user as User;
    const { slug } = req.params;
    const { sessionData } = req.body;

    const session = await surveyService.setSession(slug, userId, sessionData);

    res.json(session);
  };

  const clearSession = async (
    req: Request<{ slug: string }>,
    res: Response<void>
  ): Promise<void> => {
    const { id: userId } = req.user as User;
    const { slug } = req.params;

    await surveyService.clearSession(slug, userId);

    res.json();
  };

  const requestHelp = async (
    req: Request<{ slug: string }, any, SurveyRequestHelpInput>,
    res: Response<undefined>
  ): Promise<void> => {
    const { id: userId } = req.user as User;
    const { slug: surveySlug } = req.params;
    const { name, phone } = req.body;

    await surveyService.requestHelp({ surveySlug, userId, name, phone });

    res.json();
  };

  const submission = async (
    req: Request<{ slug: string }, any, any, { tzOffset: number }>,
    res: Response<SurveyFollowUpResponse>
  ): Promise<void> => {
    const {
      params: { slug },
      query: { tzOffset },
    } = req;
    const user = req.user as User;
    const { submission } = req.body;

    const followUpInfo = await surveySubmissionService.submit(slug, user, submission, tzOffset);

    res.json(followUpInfo);
  };

  return {
    parameters,
    userInfo,
    getSession,
    setSession,
    clearSession,
    requestHelp,
    submission,
  };
};

export default surveyRespondentController;

export type SurveyRespondentController = ReturnType<typeof surveyRespondentController>;
