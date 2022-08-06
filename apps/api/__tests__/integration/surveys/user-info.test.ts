import request from 'supertest';

import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  let url: string;
  let invalidUrl: string;

  beforeAll(async () => {
    url = `/api/surveys/${suite.data.system.survey.slug}/user-info`;
    invalidUrl = `/api/surveys/invalid-survey/user-info`;
  });

  it('should return 401 when no / invalid token', async () => {
    await suite.sharedTests.assertMissingAuthentication('get', url);
  });

  it(`should return 403 when survey record (+survey permissions) doesn't exist`, async () => {
    const { status } = await request(suite.app)
      .get(invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(403);
  });

  it('should return 422 for missing timezone offset', async () => {
    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['success', 'errors']);
    expect(body.errors).toContainAllKeys(['tzOffset']);
  });

  it('should return 422 for invalid timezone offset', async () => {
    const { status, body } = await request(suite.app)
      .get(`${url}?tzOffset=invalidTzOffset`)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['success', 'errors']);
    expect(body.errors).toContainAllKeys(['tzOffset']);
  });

  it('should return 200 and public survey record', async () => {
    const { status, body } = await request(suite.app)
      .get(`${url}?tzOffset=-60`)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(200);
    expect(body).toContainAllKeys([
      'userId',
      'name',
      'recallNumber',
      'redirectToFeedback',
      'maximumTotalSubmissionsReached',
      'maximumDailySubmissionsReached',
    ]);
  });
};
