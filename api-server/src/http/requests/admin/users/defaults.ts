import { Schema } from 'express-validator';
import User from '@/db/models/system/user';
import unique from '@/http/rules/unique';
import { roleList } from '@/services/acl.service';

export const identifiers: Schema = {
  name: {
    in: ['body'],
    errorMessage: 'Name must be a string.',
    isString: true,
    optional: { options: { nullable: true } },
  },
  email: {
    in: ['body'],
    errorMessage: 'Enter valid unique email address.',
    isEmail: true,
    optional: { options: { nullable: true } },
    custom: {
      options: async (value, meta): Promise<void> => {
        return unique({ model: User, field: 'email', value }, meta);
      },
    },
  },
  phone: {
    in: ['body'],
    errorMessage: 'Phone must be a string.',
    isString: true,
    optional: { options: { nullable: true } },
  },
};

export const password: Schema = {
  password: {
    in: ['body'],
    errorMessage: 'Enter a valid password, at least 8 chars length.',
    isString: true,
    isEmpty: { negated: true },
    isLength: { options: { min: 8 } },
  },
  passwordConfirm: {
    in: ['body'],
    errorMessage: 'Enter a valid password, at least 8 chars length.',
    isString: true,
    isEmpty: { negated: true },
    isLength: { options: { min: 8 } },
    custom: {
      options: async (value, { req }): Promise<void> => {
        return value === req.body.password
          ? Promise.resolve()
          : Promise.reject(new Error(`Passwords don't match.`));
      },
    },
  },
};

export const user: Schema = {
  roles: {
    in: ['body'],
    custom: {
      options: async (value): Promise<void> => {
        const roles = await roleList();
        return Array.isArray(value) &&
          value.every((item) => typeof item === 'string' && roles.includes(item))
          ? Promise.resolve()
          : Promise.reject(new Error('Enter a valid list of roles.'));
      },
    },
  },
  emailNotifications: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: true,
    optional: { options: { nullable: true } },
  },
  smsNotifications: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: true,
    optional: { options: { nullable: true } },
  },
  multiFactorAuthentication: {
    in: ['body'],
    errorMessage: 'Enter true/false value.',
    isBoolean: true,
    optional: { options: { nullable: true } },
  },
};
