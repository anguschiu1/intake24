import pick from 'lodash/pick';

export type ValidationError = {
  location: string;
  msg: string;
  path: string;
  type: string;
  value: string;
};

export type ValidationErrors = Record<string, ValidationError>;

export class Errors {
  private errors: ValidationErrors;

  constructor() {
    this.errors = {};
  }

  get(field: string): string | undefined {
    return this.errors[field]?.msg;
  }

  has(field: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.errors, field);
  }

  all(): ValidationErrors {
    return this.errors;
  }

  getErrors(field?: string[]): ValidationError[] {
    if (!field) return Object.values(this.errors);

    return Object.values(pick(this.errors, field));
  }

  record(errors?: ValidationErrors): void {
    if (typeof errors !== 'undefined') this.errors = errors;
  }

  clear(field?: string | string[]): void {
    if (Array.isArray(field)) {
      field.forEach((item) => delete this.errors[item]);
      return;
    }

    if (field) {
      const { [field]: discard, ...rest } = this.errors;
      this.errors = { ...rest };
      return;
    }

    this.errors = {};
  }

  any(): boolean {
    return !!Object.keys(this.errors).length;
  }
}
