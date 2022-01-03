import { pick } from 'lodash';
import request from 'supertest';
import { LanguageCreationAttributes } from '@common/types/models';
import { suite, setPermission } from '@tests/integration/helpers';
import { Language } from '@api/db';

export default (): void => {
  const baseUrl = '/api/admin/languages';

  let url: string;
  let invalidUrl: string;

  let input: LanguageCreationAttributes;
  let output: LanguageCreationAttributes;
  let language: Language;

  beforeAll(async () => {
    input = {
      id: 'es-cl',
      englishName: 'Spanish - Chile',
      localName: 'Spanish - Chile',
      countryFlagCode: 'es-cl',
      textDirection: 'ltr',
    };
    language = await Language.create(input);
    output = { ...input };

    url = `${baseUrl}/${language.id}`;
    invalidUrl = `${baseUrl}/999999`;
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
      await setPermission('languages-read');
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
