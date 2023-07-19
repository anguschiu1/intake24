import type { LocaleMessageObject } from 'vue-i18n';

const users: LocaleMessageObject = {
  _: 'User',
  title: 'Users',
  all: 'All users',
  read: 'User detail',
  create: 'Add user',
  edit: 'Edit user',
  delete: 'Delete user',

  id: 'UserID',
  name: 'Name',
  simpleName: 'Simple name',
  username: 'Username',
  verified: 'Verified',
  disabled: 'Disabled',
  aliases: {
    _: 'User alias',
    title: 'User aliases',
    surveyId: 'Survey ID',
    username: 'Username',
    urlAuthToken: 'URL Auth Token',
    none: 'No survey alias defined',
  },
  customFields: {
    _: 'Custom field',
    title: 'Custom fields',
    name: 'Field name',
    value: 'Field value',
    none: 'No custom field defined',
  },
  permissions: {
    _: 'Permission',
    title: 'Permissions',
    tab: 'Permissions',
    hint: 'Prefer permission assignment through role rather than direct permission assignment.',
  },
  roles: {
    _: 'Role',
    title: 'Roles',
    tab: 'Roles',
  },

  mfa: {
    _: 'Multi-factor authentication',
    abbr: '2FA',
  },

  notifications: {
    email: 'Email notifications',
    sms: 'SMS notifications',
  },
};

export default users;
