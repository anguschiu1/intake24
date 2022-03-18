import request from 'supertest';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { SurveySubmission } from '@intake24/db';

export default () => {
  let url: string;
  let surveyId: string;
  let userId: string;

  beforeAll(async () => {
    url = '/api/user/submissions';

    surveyId = suite.data.system.survey.id;
    userId = suite.data.system.respondent.userId;

    await SurveySubmission.create(mocker.system.submission(surveyId, userId));
  });

  afterAll(async () => {
    await SurveySubmission.destroy({ where: { userId } });
  });

  it('should return 401 when no / invalid token', async () => {
    await suite.sharedTests.assertMissingAuthentication('get', url);
  });

  it('should return 422 for missing surveyId query parameter', async () => {
    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(['surveyId']);
  });

  it('should return 200 and array of submissions', async () => {
    const { status, body } = await request(suite.app)
      .get(`${url}?surveyId=${surveyId}`)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(200);
    expect(body).toBeArrayOfSize(1);
  });

  it('should return 200 and empty array of submissions for invalid survey', async () => {
    const { status, body } = await request(suite.app)
      .get(`${url}?surveyId=nonExistingSurvey`)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(200);
    expect(body).toBeArrayOfSize(0);
  });
};
