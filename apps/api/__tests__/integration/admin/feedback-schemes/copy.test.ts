import { pick } from 'lodash';
import request from 'supertest';
import { FeedbackSchemeCreationAttributes } from '@intake24/common/types/models';
import { mocker, suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { FeedbackScheme } from '@intake24/db';

export default () => {
  const url = '/api/admin/feedback-schemes/copy';

  let input: FeedbackSchemeCreationAttributes;
  let output: FeedbackSchemeCreationAttributes;
  let scheme: FeedbackScheme;

  beforeAll(async () => {
    input = mocker.system.feedbackScheme();

    const { name } = mocker.system.feedbackScheme();
    output = { ...input, name };

    scheme = await FeedbackScheme.create(input);
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url);
  });

  describe('authenticated / authorized', () => {
    beforeAll(async () => {
      await setPermission('feedback-schemes|edit');
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertMissingInput('post', url, ['sourceId', 'name']);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ sourceId: false, name: { name: 'objectName' } });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['sourceId', 'name']);
    });

    it('should return 422 for same id/name provided', async () => {
      const { name } = input;

      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ sourceId: scheme.id, name });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['name']);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { name } = output;

      await suite.sharedTests.assertMissingRecord('post', url, { sourceId: '999999', name });
    });

    it('should return 200 and data', async () => {
      const { name } = output;

      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ sourceId: scheme.id, name });

      expect(status).toBe(200);
      expect(pick(body, Object.keys(input))).toEqual(output);
    });
  });
};
