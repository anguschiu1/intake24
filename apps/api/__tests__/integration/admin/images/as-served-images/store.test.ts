import fs from 'fs-extra';
import { pick } from 'lodash';
import request from 'supertest';
import { suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { AsServedImageEntry } from '@intake24/common/types/http/admin';

export default () => {
  const url = '/api/admin/images/as-served/asServedSetForImages/images';
  const invalidUrl = '/api/admin/images/as-served/invalidAsServedSetForImages/images';

  const fileName = 'asServedImage_001.jpg';
  const weight = 10;

  let filePath: string;
  let output: Pick<AsServedImageEntry, 'weight'>;

  beforeAll(async () => {
    filePath = suite.files.images.jpg;

    output = { weight };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url);
  });

  describe('authenticated / authorized', () => {
    beforeAll(async () => {
      await setPermission('as-served|create');
    });

    it(`should return 404 when parent record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .post(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .field('weight', weight)
        .attach('image', fs.createReadStream(filePath), fileName);

      expect(status).toBe(404);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertMissingInput('post', url, ['image', 'weight']);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .field('weight', 'notANumber')
        .field('image', 'notAFile');

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['image', 'weight']);
    });

    it('should return 201 and new resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .field('weight', weight)
        .attach('image', fs.createReadStream(filePath), fileName);

      expect(status).toBe(201);
      expect(pick(body, Object.keys(output))).toEqual(output);
    });
  });
};
