import { pick } from 'lodash';
import request from 'supertest';
import { LocaleAttributes } from '@intake24/common/types/models';
import { suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { FoodsLocale, SystemLocale } from '@intake24/db';

export default (): void => {
  const baseUrl = '/api/admin/locales';

  let url: string;
  let invalidUrl: string;

  let input: LocaleAttributes;
  let updateInput: LocaleAttributes;
  let output: LocaleAttributes;
  let systemLocale: SystemLocale;

  beforeAll(async () => {
    const { id: langId } = suite.data.system.language;
    input = {
      id: 'en-ie',
      englishName: 'English - Ireland',
      localName: 'English - Ireland',
      respondentLanguageId: langId,
      adminLanguageId: langId,
      countryFlagCode: 'en-ie',
      prototypeLocaleId: null,
      textDirection: 'ltr',
    };
    updateInput = {
      id: 'en-jm',
      englishName: 'English - Jamaica',
      localName: 'English - Jamaica',
      respondentLanguageId: langId,
      adminLanguageId: langId,
      countryFlagCode: 'en-jm',
      prototypeLocaleId: null,
      textDirection: 'ltr',
    };

    const { id } = input;
    output = { ...updateInput, id };

    await FoodsLocale.create(input);
    systemLocale = await SystemLocale.create(input);

    url = `${baseUrl}/${systemLocale.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).put(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .put(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission('locales|edit');
    });

    it('should return 422 for missing input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'englishName',
        'localName',
        'respondentLanguageId',
        'adminLanguageId',
        'countryFlagCode',
        'textDirection',
      ]);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          englishName: { name: 'United Kingdom' },
          localName: ['United Kingdom'],
          respondentLanguageId: 10,
          adminLanguageId: 'nonLocaleString',
          countryFlagCode: false,
          prototypeLocaleId: 'nonExistingLocale',
          textDirection: 'wrongDirection',
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'englishName',
        'localName',
        'respondentLanguageId',
        'adminLanguageId',
        'countryFlagCode',
        'prototypeLocaleId',
        'textDirection',
      ]);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .put(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(404);
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
