import { LocaleMessages } from 'vue-i18n';
import common from './common';
import dashboard from './dashboard';
import fdbs from './fdbs';
import feedbackSchemes from './feedback-schemes';
import foodGroups from './food-groups';
import flags from './flags';
import asServed from './as-served';
import guideImages from './guide-images';
import imageMaps from './image-maps';
import jobs from './jobs';
import languages from './languages';
import locales from './locales';
import nutrientTables from './nutrient-tables';
import permissions from './permissions';
import roles from './roles';
import surveySchemes from './survey-schemes';
import surveySchemeQuestions from './survey-scheme-questions';
import signInLogs from './sign-in-logs';
import surveys from './surveys';
import tasks from './tasks';
import user from './user';
import users from './users';

const messages: LocaleMessages = {
  common,
  dashboard,
  fdbs,
  'feedback-schemes': feedbackSchemes,
  'food-groups': foodGroups,
  flags,
  'as-served': asServed,
  'guide-images': guideImages,
  'image-maps': imageMaps,
  jobs,
  languages,
  locales,
  'nutrient-tables': nutrientTables,
  permissions,
  roles,
  'survey-schemes': surveySchemes,
  'survey-scheme-questions': surveySchemeQuestions,
  'sign-in-logs': signInLogs,
  surveys,
  tasks,
  user,
  users,
};

export default messages;
