import type { LocaleMessageObject } from 'vue-i18n';

const languages: LocaleMessageObject = {
  _: 'Languages',
  id: 'Language ID',
  title: 'Languages',
  all: 'All languages',
  read: 'Language detail',
  create: 'Add language',
  edit: 'Edit language',
  delete: 'Delete language',

  englishName: 'English name',
  localName: 'Local name',
  countryFlagCode: 'Country flag code',
  textDirections: {
    _: 'Text direction',
    ltr: 'Left to right',
    rtl: 'Right to left',
  },
  foodIndexLanguageBackend: 'Food index language backend',

  translations: {
    _: 'Translation',
    title: 'Translations',
    tab: 'Translations',
    create: 'Initialize translations',
    edit: 'Edit section',
    delete: 'Delete language translations',
    sync: 'Synchronize language translations',
    path: 'Key path',
    applications: {
      admin: 'Admin',
      api: 'API',
      survey: 'Survey',
      shared: 'Shared',
    },
    sections: {
      breadcrumbs: 'Breadcrumbs',
      feedback: 'Feedback',
      flags: 'Flags',
      login: 'Login',
      portion: 'Portion sizes',
      profile: 'Profile',
      prompts: 'Prompts',
      recall: 'Recall',
      'standard-units': 'Standard units',
      survey: 'Survey',
      validation: 'Validation',
    },

    created: 'Language translations ({name}) has been created.',
    updated: 'Language translations ({name}) has been updated.',
    deleted: 'Language translations ({name}) has been deleted.',
    synced: 'Language translations ({name}) has been synchronized.',
  },
};

export default languages;
