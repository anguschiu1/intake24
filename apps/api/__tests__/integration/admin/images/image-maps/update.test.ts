import fs from 'fs-extra';
import request from 'supertest';

import type { ImageMapEntry } from '@intake24/common/types/http/admin';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const baseUrl = '/api/admin/images/image-maps';
  const permissions = ['image-maps', 'image-maps|edit'];

  const fileName = 'imageMap_004.jpg';
  const id = 'imageMap_004';
  const description = 'imageMap_004_description';

  const updateInput = {
    description: 'updated_imageMap_004_description',
    objects: [
      {
        id: '0',
        description: 'obj_description_0',
        label: { en: 'obj_label_0' },
        outlineCoordinates: [1, 2, 3, 4, 5, 6],
      },
      {
        id: '1',
        description: 'obj_description_1',
        label: { en: 'obj_label_1' },
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
    await suite.sharedTests.assert401and403('put', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('put', url, ['description', 'objects']);
    });

    it('should return 422 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput('put', url, ['description', 'objects'], {
        input: {
          description: ['invalid description'],
          objects: 'notValidObjects',
        },
      });
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('put', invalidUrl, { input: updateInput });
    });

    it('should return 200 and data', async () => {
      await suite.sharedTests.assertRecordUpdated('put', url, output, { input: updateInput });
    });
  });
};
