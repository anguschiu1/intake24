import { Dictionary } from '@intake24/common/types';
import authentication from './authentication';
import dashboard from './dashboard.vue';
import fdbs from './fdbs';
import foodGroups from './food-groups';
import images from './images';
import jobs from './jobs';
import languages from './languages';
import locales from './locales';
import nutrientTables from './nutrient-tables';
import schemes from './schemes';
import schemeQuestions from './scheme-questions';
import signInLogs from './sign-in-logs';
import surveys from './surveys';
import permissions from './permissions';
import roles from './roles';
import tasks from './tasks';
import user from './user';
import users from './users';

const views: Dictionary = {
  authentication,
  dashboard,
  fdbs,
  'food-groups': foodGroups,
  images,
  jobs,
  languages,
  locales,
  'nutrient-tables': nutrientTables,
  schemes,
  'scheme-questions': schemeQuestions,
  'sign-in-logs': signInLogs,
  surveys,
  permissions,
  roles,
  tasks,
  user,
  users,
};

export default views;
