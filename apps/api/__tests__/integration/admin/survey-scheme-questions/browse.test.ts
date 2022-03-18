import { suite, setPermission } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/survey-scheme-questions';

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  it('should return 200 and paginated results', async () => {
    await setPermission('survey-scheme-questions|browse');

    await suite.sharedTests.assertPaginatedResult('get', url, true);
  });
};
