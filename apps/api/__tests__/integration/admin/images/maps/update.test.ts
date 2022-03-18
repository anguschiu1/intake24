import fs from 'fs-extra';
import { pick } from 'lodash';
import request from 'supertest';
import { suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { ImageMapEntry } from '@intake24/common/types/http/admin';

export default () => {
  const baseUrl = '/api/admin/images/maps';

  const fileName = 'imageMap_004.jpg';
  const id = 'imageMap_004';
  const description = 'imageMap_004_description';

  const updateInput = {
    description: 'updated_imageMap_004_description',
    objects: [
      {
        id: '0',
        description: 'obj_description_0',
        outlineCoordinates: [1, 2, 3, 4, 5, 6],
      },
      {
        id: '1',
        description: 'obj_description_1',
        outlineCoordinates: [7, 8, 9, 10, 11, 12],
      },
    ],
  };

  const url = `${baseUrl}/${id}`;
  const invalidUrl = `${baseUrl}/999999`;

  let output: ImageMapEntry;

  beforeAll(async () => {
    const { body } = await request(suite.app)
      .post(baseUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .field('id', id)
      .field('description', description)
      .attach('baseImage', fs.createReadStream(suite.files.images.jpg), fileName);

    output = { ...body, ...updateInput };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('put', url);
  });

  describe('authenticated / authorized', () => {
    beforeAll(async () => {
      await setPermission('image-maps|edit');
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertMissingInput('put', url, ['description', 'objects']);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          description: ['invalid description'],
          objects: 'notValidObjects',
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['description', 'objects']);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('put', invalidUrl, updateInput);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(200);
      expect(pick(body, Object.keys(output))).toEqual(output);
    });
  });
};
