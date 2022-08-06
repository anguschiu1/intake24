import type { ValidateFunction as AjvValidateFunction } from 'ajv';
import Ajv from 'ajv';
import { inspect } from 'util';

import type { NutrientTableCsvMappingFieldsInput } from '../../types/http/admin/nutrient-tables';

export const ajv = new Ajv({
  allErrors: true,
  coerceTypes: false,
  useDefaults: true,
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

export { NutrientTableCsvMappingFieldsInput };
export const NutrientTableCsvMappingFieldsInputSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    'Pick<NutrientTableCsvMappingFieldAttributes,"fieldName"|"columnOffset">': {
      properties: {
        columnOffset: {
          type: 'number',
        },
        fieldName: {
          type: 'string',
        },
      },
      required: ['columnOffset', 'fieldName'],
      type: 'object',
    },
  },
  items: {
    $ref: '#/definitions/Pick<NutrientTableCsvMappingFieldAttributes,"fieldName"|"columnOffset">',
  },
  type: 'array',
};
export type ValidateFunction<T> = ((data: unknown) => data is T) &
  Pick<AjvValidateFunction, 'errors'>;
export const isNutrientTableCsvMappingFieldsInput = ajv.compile(
  NutrientTableCsvMappingFieldsInputSchema
) as ValidateFunction<NutrientTableCsvMappingFieldsInput>;
export default function validate(value: unknown): NutrientTableCsvMappingFieldsInput {
  if (isNutrientTableCsvMappingFieldsInput(value)) {
    return value;
  }
  throw new Error(
    `${ajv.errorsText(
      isNutrientTableCsvMappingFieldsInput.errors!.filter((e: any) => e.keyword !== 'if'),
      { dataVar: 'NutrientTableCsvMappingFieldsInput' }
    )}\n\n${inspect(value)}`
  );
}
