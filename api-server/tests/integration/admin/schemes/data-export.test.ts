import request from 'supertest';
import { SchemeCreationAttributes } from '@common/types/models';
import { mocker, suite, setPermission } from '@tests/integration/helpers';
import { Scheme } from '@/db/models/system';

export default (): void => {
  const baseUrl = '/api/admin/schemes';

  let url: string;
  let invalidUrl: string;

  let input: SchemeCreationAttributes;
  let scheme: Scheme;

  beforeAll(async () => {
    input = mocker.scheme();
    scheme = await Scheme.create(input);

    url = `${baseUrl}/${scheme.id}/data-export`;
    invalidUrl = `${baseUrl}/999999/data-export`;
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
      await setPermission('schemes-edit');
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .get(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(404);
    });

    it('should return 200 and data/refs', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);
      expect(body).toContainAllKeys([
        'user',
        'userCustom',
        'survey',
        'surveyCustom',
        'meal',
        'mealCustom',
        'food',
        'foodCustom',
        'foodFields',
        'foodNutrients',
        'portionSizes',
      ]);

      for (const field of Object.values(body)) {
        expect(field).toBeArray();
      }
    });
  });
};
