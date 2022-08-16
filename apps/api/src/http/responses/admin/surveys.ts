import type { SurveyEntry, SurveyListEntry } from '@intake24/common/types/http/admin';
import type { Survey } from '@intake24/db';

export const surveyListResponse = (survey: Survey): SurveyListEntry => {
  const { id, slug, name, localeId, surveySchemeId, state, securables = [] } = survey;
  return { id, slug, name, localeId, surveySchemeId, state, securables };
};

export const surveyResponse = (survey: Survey): SurveyEntry => ({
  ...survey.get(),
  startDate: survey.startDate.toISOString().split('T')[0],
  endDate: survey.endDate.toISOString().split('T')[0],
});
