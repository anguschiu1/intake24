import type { Resource } from '@intake24/admin/types';

const routes: string[] = ['create', 'read', 'edit'];

const resources: Resource[] = [
  // Food databases
  {
    group: 'fdb',
    name: 'fdbs',
    icon: 'fas fa-drumstick-bite',
    api: 'admin/fdbs',
    generateRoutes: false,
    routes: ['read'],
  },
  {
    group: 'fdb',
    name: 'food-groups',
    icon: 'fas fa-utensils',
    api: 'admin/food-groups',
    generateRoutes: true,
    routes: [...routes],
  },
  {
    group: 'fdb',
    name: 'nutrient-tables',
    icon: 'fas fa-seedling',
    api: 'admin/nutrient-tables',
    generateRoutes: true,
    routes: [...routes, 'upload'],
  },
  // Localization
  {
    group: 'local',
    name: 'languages',
    icon: 'fas fa-language',
    api: 'admin/languages',
    generateRoutes: true,
    routes: [...routes, 'translations'],
  },
  {
    group: 'local',
    name: 'locales',
    icon: 'fas fa-map-marked-alt',
    api: 'admin/locales',
    generateRoutes: true,
    routes: [...routes],
  },
  // Surveys
  {
    group: 'surveyMgmt',
    name: 'feedback-schemes',
    icon: 'fas fa-comment-dots',
    api: 'admin/feedback-schemes',
    securable: true,
    generateRoutes: true,
    routes: [
      ...routes,
      'top-foods',
      'cards',
      'demographic-groups',
      'henry-coefficients',
      'securables',
    ],
  },
  {
    group: 'surveyMgmt',
    name: 'survey-schemes',
    icon: 'fas fa-route',
    api: 'admin/survey-schemes',
    securable: true,
    generateRoutes: true,
    routes: [...routes, 'questions', 'data-export', 'securables'],
  },
  {
    group: 'surveyMgmt',
    name: 'survey-scheme-questions',
    // path: 'scheme-questions',
    icon: 'far fa-question-circle',
    api: 'admin/survey-scheme-questions',
    generateRoutes: true,
    routes: [...routes, 'sync'],
  },
  {
    group: 'surveyMgmt',
    name: 'surveys',
    icon: 'fas fa-poll',
    api: 'admin/surveys',
    securable: true,
    generateRoutes: true,
    routes: [...routes, 'overrides', 'respondents', 'submissions', 'data-export', 'securables'],
  },
  // Images
  {
    group: 'images',
    name: 'as-served',
    path: 'images/as-served',
    icon: 'fas fa-utensils',
    api: 'admin/images/as-served',
    generateRoutes: true,
    routes: [...routes],
  },
  {
    group: 'images',
    name: 'image-maps',
    path: 'images/maps',
    icon: 'fas fa-draw-polygon',
    api: 'admin/images/maps',
    generateRoutes: true,
    routes: [...routes],
  },
  {
    group: 'images',
    name: 'guide-images',
    path: 'images/guides',
    icon: 'fas fa-crosshairs',
    api: 'admin/images/guides',
    generateRoutes: true,
    routes: [...routes],
  },
  // System
  {
    group: 'system',
    name: 'jobs',
    icon: 'fas fa-running',
    api: 'admin/jobs',
    generateRoutes: true,
    routes: ['read'],
  },
  {
    group: 'system',
    name: 'sign-in-logs',
    icon: 'fas fa-sign-in-alt',
    api: 'admin/sign-in-logs',
    generateRoutes: true,
    routes: ['read'],
  },
  {
    group: 'system',
    name: 'tasks',
    icon: 'fas fa-tasks',
    api: 'admin/tasks',
    generateRoutes: true,
    routes: [...routes],
  },
  // ACL
  {
    group: 'acl',
    name: 'users',
    icon: 'fas fa-fw fa-users',
    api: 'admin/users',
    generateRoutes: true,
    routes: [...routes],
  },
  {
    group: 'acl',
    name: 'roles',
    icon: 'far fa-fw fa-id-badge',
    api: 'admin/roles',
    generateRoutes: true,
    routes: [...routes],
  },
  {
    group: 'acl',
    name: 'permissions',
    icon: 'far fa-fw fa-eye-slash',
    api: 'admin/permissions',
    generateRoutes: true,
    routes: [...routes],
  },
];

export default resources;
