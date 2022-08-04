import { body } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';

export default validate(
  body()
    .isArray()
    .withMessage('Value has to be an array')
    .bail()
    .custom((value: any[]) => {
      if (
        value.some(
          ({ id, words }) =>
            (typeof id !== 'undefined' && typeof id !== 'string') || typeof words !== 'string'
        )
      )
        return false;

      return true;
    })
    .withMessage('Invalid split words')
);
