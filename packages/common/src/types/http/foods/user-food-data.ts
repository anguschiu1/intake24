import type { PortionSizeMethodId, RequiredLocaleTranslation } from '../..';

type StandardUnitString =
  | `unit${number}-name`
  | `unit${number}-omit-food-description`
  | `unit${number}-weight`;

type StandardUnitTranslation = `unit${number}-howMany` | `unit${number}-estimateIn`;

type StandardUnitTexts = {
  [standardUnitString in StandardUnitString]: string;
};

type StandardUnitTranslations = {
  [standardUnitTranslation in StandardUnitTranslation]: RequiredLocaleTranslation;
};

export interface AsServedParameters {
  'serving-image-set': string;
  'leftovers-image-set'?: string;
}

export type CerealType = 'hoop' | 'flake ' | 'rkris';

export interface CerealParameters {
  type: CerealType;
}

export interface GuideImageParameters {
  'guide-image-id': string;
}

export interface DrinkScaleParameters {
  'drinkware-id': string;
  'initial-fill-level': string;
  'skip-fill-level': string;
}

export interface StandardPortionParams extends StandardUnitTexts, StandardUnitTranslations {
  'units-count': string;
}

// TODO: generic mapping from DB -> should use union of methods?
export interface UserPortionSizeMethodParameters {
  [name: string]: string;
}

export interface UserPortionSizeMethod {
  method: PortionSizeMethodId;
  description: string;
  imageUrl: string;
  useForRecipes: boolean;
  conversionFactor: number;
  parameters: UserPortionSizeMethodParameters;
}

export type UserAssociatedFoodPrompt = {
  foodCode: string | undefined;
  categoryCode: string | undefined;
  promptText: string;
  linkAsMain: boolean;
  genericName: string;
};

export interface UserFoodData {
  code: string;
  englishName: string;
  localName: string;
  groupCode: string;
  kcalPer100g: number;
  reasonableAmount: number;
  readyMealOption: boolean;
  sameAsBeforeOption: boolean;
  portionSizeMethods: UserPortionSizeMethod[];
  associatedFoodPrompts: UserAssociatedFoodPrompt[];
  brandNames: string[];
}
