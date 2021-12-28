import { checkSchema } from 'express-validator';
import validate from '@api/http/requests/validate';
import defaults from './defaults';
import { attributes, categories } from '../common';

export default validate(checkSchema({ ...defaults, ...attributes, ...categories }));
