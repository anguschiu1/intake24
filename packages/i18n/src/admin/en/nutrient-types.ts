import type { LocaleMessageObject } from 'vue-i18n';

const nutrientTypes: LocaleMessageObject = {
  _: 'Nutrient type',
  title: 'Nutrient types',
  read: 'Nutrient type detail',
  add: 'Add nutrient type',
  create: 'Add nutrient type',
  edit: 'Edit nutrient type',
  remove: 'Remove nutrient type',
  label: 'Nutrient type label',
  current: 'Current nutrient types',
  available: 'Available nutrient types',

  id: 'Nutrient type ID',
  kcalPerUnit: 'Kcal per unit',

  reset: {
    _: 'Reset nutrient types',
    text: 'Reset nutrient types to default list',
  },
  validation: {
    required: 'Nutrient type must be filled in.',
    unique: 'Nutrient types combination already exists in current list.',
  },
};

export default nutrientTypes;
