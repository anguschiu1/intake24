import authentication from './authentication/index.test';
import fdbs from './fdbs/index.test';
import feedbackSchemes from './feedback-schemes/index.test';
import foodGroups from './food-groups/index.test';
import images from './images/index.test';
import jobs from './jobs/index.test';
import languages from './languages/index.test';
import locales from './locales/index.test';
import nutrientTables from './nutrient-tables/index.test';
import nutrientTypes from './nutrient-types/index.test';
import nutrientUnits from './nutrient-units/index.test';
import permissions from './permissions/index.test';
import roles from './roles/index.test';
import signInLogs from './sign-in-logs/index.test';
import signup from './signup/index.test';
import surveySchemeQuestions from './survey-scheme-questions/index.test';
import surveySchemes from './survey-schemes/index.test';
import surveys from './surveys/index.test';
import tasks from './tasks/index.test';
import user from './user/profile.test';
import users from './users/index.test';

export default () => {
  describe('/api/admin/auth', authentication);
  describe('/api/admin/signup', signup);
  describe('/api/admin/fdbs', fdbs);
  describe('/api/admin/feedback-schemes', feedbackSchemes);
  describe('/api/admin/food-groups', foodGroups);
  describe('/api/admin/images', images);
  describe('/api/admin/jobs', jobs);
  describe('/api/admin/languages', languages);
  describe('/api/admin/locales', locales);
  describe('/api/admin/nutrient-tables', nutrientTables);
  describe('/api/admin/nutrient-types', nutrientTypes);
  describe('/api/admin/nutrient-units', nutrientUnits);
  describe('/api/admin/permissions', permissions);
  describe('/api/admin/roles', roles);
  describe('/api/admin/sign-in-logs', signInLogs);
  describe('/api/admin/survey-schemes', surveySchemes);
  describe('/api/admin/survey-scheme-questions', surveySchemeQuestions);
  describe('/api/admin/surveys', surveys);
  describe('/api/admin/tasks', tasks);
  describe('/api/admin/user', user);
  describe('/api/admin/users', users);
};
