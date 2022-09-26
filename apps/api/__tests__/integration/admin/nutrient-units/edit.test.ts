import type { NutrientUnitRequest } from '@intake24/common/types/http/admin';
import type { FoodsNutrientUnit } from '@intake24/db';
import ioc from '@intake24/api/ioc';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const baseUrl = '/api/admin/nutrient-units';
  const permissions = ['nutrient-units', 'nutrient-units|edit'];

  let url: string;
  let invalidUrl: string;

  let input: NutrientUnitRequest;
  let nutrientUnit: FoodsNutrientUnit;

  beforeAll(async () => {
    input = mocker.foods.nutrientUnit();
    nutrientUnit = await ioc.cradle.nutrientUnitService.createNutrientUnit(input);

    url = `${baseUrl}/${nutrientUnit.id}/edit`;
    invalidUrl = `${baseUrl}/999999/edit`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('get', invalidUrl);
    });

    it('should return 200 and data', async () => {
      await suite.sharedTests.assertRecord('get', url, input);
    });
  });
};
