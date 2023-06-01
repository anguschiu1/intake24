import type { CreateUserRequest } from '@intake24/common/types/http/admin';
import type { User } from '@intake24/db';
import ioc from '@intake24/api/ioc';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const baseUrl = '/api/admin/users';
  const permissions = ['acl', 'users', 'users|roles'];

  let url: string;
  let invalidUrl: string;

  let input: CreateUserRequest;
  let user: User;

  beforeAll(async () => {
    input = mocker.system.user();
    user = await ioc.cradle.adminUserService.create(input);

    url = `${baseUrl}/${user.id}/roles`;
    invalidUrl = `${baseUrl}/999999/roles`;
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
      await suite.sharedTests.assertPaginatedResult('get', url);
    });
  });
};
