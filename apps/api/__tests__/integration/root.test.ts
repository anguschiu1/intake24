import fs from 'fs-extra';
import path from 'node:path';
import request from 'supertest';

import fsConfig from '@intake24/api/config/filesystem';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  it('GET / should render when SPA app if deployed', async () => {
    const exists = fs.existsSync(path.resolve(fsConfig.local.public, 'survey', 'index.html'));

    const res = await request(suite.app).get('/').set('Accept', 'application/json');

    expect(res.status).toBe(exists ? 200 : 404);
  });

  it('GET /some-existing-route render when SPA app if deployed', async () => {
    const exists = fs.existsSync(path.resolve(fsConfig.local.public, 'survey', 'index.html'));

    const res = await request(suite.app)
      .get('/some-existing-route')
      .set('Accept', 'application/json');

    expect(res.status).toBe(exists ? 200 : 404);
  });
};
