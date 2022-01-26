import { pick } from 'lodash';
import request from 'supertest';
import { SchemeQuestionCreationAttributes } from '@intake24/common/types/models';
import { mocker, suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { SchemeQuestion } from '@intake24/db';

export default (): void => {
  const baseUrl = '/api/admin/scheme-questions';

  let url: string;
  let invalidUrl: string;

  let input: SchemeQuestionCreationAttributes;
  let output: SchemeQuestionCreationAttributes;
  let schemeQuestion: SchemeQuestion;

  beforeAll(async () => {
    input = mocker.system.schemeQuestion();
    schemeQuestion = await SchemeQuestion.create(input);
    output = { ...input };

    url = `${baseUrl}/${schemeQuestion.id}/edit`;
    invalidUrl = `${baseUrl}/999999/edit`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission('scheme-questions|edit');
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .get(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(404);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);
      expect(pick(body, Object.keys(output))).toEqual(output);
    });
  });
};
