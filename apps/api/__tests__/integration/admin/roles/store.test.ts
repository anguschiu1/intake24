import { pick, omit } from 'lodash';
import request from 'supertest';
import { RoleRequest } from '@intake24/common/types/http/admin';
import { mocker, suite, setPermission } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/roles';

  let input: RoleRequest;
  let output: Omit<RoleRequest, 'permissions'>;

  beforeAll(async () => {
    input = mocker.system.role();
    output = omit(input, 'permissions');
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission('acl');

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('authenticated / authorized', () => {
    beforeAll(async () => {
      await setPermission(['acl', 'roles|create']);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertMissingInput('post', url, [
        'name',
        'displayName',
        'permissions',
      ]);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ name: '', displayName: '', permissions: [1, 'invalidId', 2] });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['name', 'displayName', 'permissions']);
    });

    it('should return 201 and new resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(201);
      expect(pick(body, Object.keys(output))).toEqual(output);
    });

    it('should return 422 for duplicate name', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['name']);
    });
  });
};
