import { checkSchema } from 'express-validator';
import { validatePushSubscription } from '@intake24/common/validators';
import validate from '@intake24/api/http/requests/validate';

export default validate(
  checkSchema({
    subscription: {
      in: ['body'],
      errorMessage: 'Invalid subscription object.',
      custom: {
        options: (value): boolean => {
          validatePushSubscription(value);
          return true;
        },
      },
    },
  })
);
