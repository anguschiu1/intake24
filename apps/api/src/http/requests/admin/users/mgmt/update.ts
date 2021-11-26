import { Request } from 'express';
import { checkSchema } from 'express-validator';
import validate from '@api/http/requests/validate';
import ioc from '@api/ioc';

export default validate(
  checkSchema({
    userId: {
      in: ['params'],
      errorMessage: 'Please select an user.',
      isInt: true,
      toInt: true,
    },
    permissions: {
      in: ['body'],
      custom: {
        options: async (value, { req }): Promise<void> => {
          const { surveyId } = (req as Request).params;

          const permissions = await ioc.cradle.adminSurveyService.getSurveyMgmtPermissions(
            surveyId
          );
          const allowedPermissions = permissions.map((permission) => permission.id);

          if (!Array.isArray(value) || value.some((item) => !allowedPermissions.includes(item)))
            throw new Error('Enter a valid list of survey management permissions.');

          Promise.resolve();
        },
      },
    },
  })
);
