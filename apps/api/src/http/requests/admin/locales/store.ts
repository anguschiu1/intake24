import { checkSchema } from 'express-validator';
import { SystemLocale } from '@intake24/db';
import validate from '@intake24/api/http/requests/validate';
import { unique } from '@intake24/api/http/rules';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: 'Locale ID must be unique locale code.',
      isLocale: true,
      isEmpty: { negated: true },
      custom: {
        options: async (value): Promise<void> =>
          unique({ model: SystemLocale, condition: { field: 'id', value } }),
      },
    },
  })
);
