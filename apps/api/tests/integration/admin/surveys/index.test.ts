import browse from './browse.test';
import create from './create.test';
import store from './store.test';
import read from './read.test';
import edit from './edit.test';
import update from './update.test';
import destroy from './destroy.test';
import mgmt from './mgmt/index.test';
import dataExport from './data-export/index.test';
import respondents from './respondents/index.test';

export default () => {
  describe('GET /api/admin/surveys', browse);
  describe('GET /api/admin/surveys/create', create);
  describe('POST /api/admin/surveys', store);
  describe('GET /api/admin/surveys/:surveyId', read);
  describe('GET /api/admin/surveys/:surveyId/edit', edit);
  describe('PUT /api/admin/surveys/:surveyId', update);
  describe('DELETE /api/admin/surveys/:surveyId', destroy);

  // Surveys user management
  describe('GET /api/admin/surveys/:surveyId/mgmt', mgmt.browse);
  describe('POST /api/admin/surveys/:surveyId/mgmt', mgmt.store);
  describe('GET /api/admin/surveys/:surveyId/mgmt/permissions', mgmt.availablePermissions);
  describe('GET /api/admin/surveys/:surveyId/mgmt/users', mgmt.availableUsers);
  describe('PATCH /api/admin/surveys/:surveyId/mgmt/:userId', mgmt.update);

  // Surveys respondents
  describe('GET /api/admin/surveys/:surveyId/respondents', respondents.browse);
  describe('POST /api/admin/surveys/:surveyId/respondents', respondents.store);
  describe('POST /api/admin/surveys/:surveyId/upload', respondents.upload);
  describe('POST /api/admin/surveys/:surveyId/export-auth-urls', respondents.exportAuthUrls);
  describe('PUT /api/admin/surveys/:surveyId/respondents/:userId', respondents.update);
  describe('DELETE /api/admin/surveys/:surveyId/respondents/:userId', respondents.destroy);

  // Surveys submissions
  // describe('GET /api/admin/surveys/:surveyId/submissions', surveys.respondents.submissions.browse);
  // describe('GET /api/admin/surveys/:surveyId/submissions/:submissionId', surveys.respondents.submissions.read);
  // describe('DELETE /api/admin/surveys/:surveyId/submissions/:submissionId', surveys.respondents.submissions.destroy);

  // Surveys data-export
  describe('POST /api/admin/surveys/:surveyId/data-export', dataExport.queue);
  describe('POST /api/admin/surveys/:surveyId/data-export/sync', dataExport.sync);
};
