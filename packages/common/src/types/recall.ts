import type { Dictionary, RequiredLocaleTranslation } from '@intake24/common/types';

import type { ComponentType, QuantityValues } from '../prompts';
import type { CerealType, FoodHeader, UserFoodData } from './http';

/*
Not currently used:

private static final String FLAG_NO_MEALS_AFTER = "no-meals-after";
private static final String FLAG_NO_MEALS_BEFORE = "no-meals-before";
private static final String FLAG_CONFIRMED_NO_DRINKS = "confirmed-no-drinks";
private static final String FLAG_READY_MEALS_COMPLETE = "ready-meals-complete";
private static final String FLAG_ASSOCIATED_FOODS_COMPLETE = "associated-foods-complete";
*/
export type MealFlag = 'free-entry-complete';

export type CustomPromptAnswer = string | string[] | number | number[];

// Portion size parameters

export type CerealType = 'hoop' | 'flake' | 'rkris';

export type StandardUnitString =
  | `unit${number}-name`
  | `unit${number}-omit-food-description`
  | `unit${number}-weight`;

export type StandardUnitTranslation = `unit${number}-howMany` | `unit${number}-estimateIn`;

export type StandardUnitTexts = {
  [standardUnitString in StandardUnitString]: string;
};

export type StandardUnitTranslations = {
  [standardUnitTranslation in StandardUnitTranslation]: RequiredLocaleTranslation;
};

export type PortionSizeParameters = {
  'as-served': {
    'serving-image-set': string;
    'leftovers-image-set'?: string;
  };
  cereal: {
    type: CerealType;
  };
  'drink-scale': {
    'drinkware-id': string;
    'initial-fill-level': string;
    'skip-fill-level': string;
  };
  'guide-image': {
    'guide-image-id': string;
  };
  'milk-in-a-hot-drink': never;
  'milk-on-cereal': never;
  pizza: never;
  'standard-portion': StandardUnitTexts &
    StandardUnitTranslations & {
      'units-count': string;
    };
  weight: never;
};

export type AsServedParameters = PortionSizeParameters['as-served'];

export type CerealParameters = PortionSizeParameters['cereal'];

export type DrinkScaleParameters = PortionSizeParameters['drink-scale'];

export type GuideImageParameters = PortionSizeParameters['guide-image'];

export type StandardPortionParams = PortionSizeParameters['standard-portion'];

// Portion size states

export interface PortionSizeStateBase {
  servingWeight: number | null;
  leftoversWeight: number | null;
}

export interface SelectedAsServedImage {
  asServedSetId: string;
  imageUrl: string;
  index: number;
  weight: number;
}

export interface SelectedGuideImageObject {
  guideImageId: string;
  imageUrl: string;
  id: number;
  weight: number;
}

export interface StandardPortionUnit {
  name: string;
  weight: number;
  omitFoodDescription: boolean;
}

export type PortionSizeStates = {
  'as-served': PortionSizeStateBase & {
    method: 'as-served';
    serving: SelectedAsServedImage | null;
    leftovers: SelectedAsServedImage | null;
  };
  cereal: PortionSizeStateBase & {
    method: 'cereal';
    type: CerealType;
    bowl: string | null;
    bowlIndex?: number;
    serving: SelectedAsServedImage | null;
    leftovers: SelectedAsServedImage | null;
  };
  'drink-scale': PortionSizeStateBase & {
    method: 'drink-scale';
    leftoversLevel: number;
    initialFillLevel: string;
    fillLevel: number;
    skipFillLevel: string;
    imageUrl: string;
    drinkwareId: string;
    containerIndex: number;
    leftovers: boolean;
  };
  'guide-image': PortionSizeStateBase & {
    method: 'guide-image';
    object: SelectedGuideImageObject | null;
    quantity: QuantityValues;
  };
  'milk-in-a-hot-drink': PortionSizeStateBase & {
    method: 'milk-in-a-hot-drink';
    milkPartIndex: number | null;
    milkVolumePercentage: number | null;
  };
  'milk-on-cereal': PortionSizeStateBase & { method: 'milk-on-cereal' };
  pizza: PortionSizeStateBase & { method: 'pizza' };
  'standard-portion': PortionSizeStateBase & {
    method: 'standard-portion';
    unit: StandardPortionUnit | null;
    quantity: QuantityValues | null;
  };
  weight: PortionSizeStateBase & { method: 'weight' };
};

export type AsServedState = PortionSizeStates['as-served'];
export type CerealState = PortionSizeStates['cereal'];
export type GuideImageState = PortionSizeStates['guide-image'];
export type DrinkScaleState = PortionSizeStates['drink-scale'];
export type MilkInAHotDrinkState = PortionSizeStates['milk-in-a-hot-drink'];
export type PizzaState = PortionSizeStates['pizza'];
export type StandardPortionState = PortionSizeStates['standard-portion'];

export type PortionSizeMethodId = keyof PortionSizeStates;
export type PortionSizeState = PortionSizeStates[keyof PortionSizeStates];

export type GetPortionSizeState<P extends keyof PortionSizeStates> = PortionSizeStates[P];

export const portionSizeMethods: PortionSizeMethodId[] = [
  'as-served',
  'guide-image',
  'drink-scale',
  'standard-portion',
  'cereal',
  'milk-on-cereal',
  'pizza',
  'milk-in-a-hot-drink',
  'weight',
];

export interface AssociatedFoodPromptState {
  confirmed: boolean | undefined;
  selectedFood: FoodHeader | undefined;
}

export interface AssociatedFoodsState {
  activePrompt: number;
  prompts: AssociatedFoodPromptState[];
}

export interface AbstractFoodState {
  id: number;
  flags: string[];
  // eslint-disable-next-line no-use-before-define
  linkedFoods: FoodState[];
  customPromptAnswers: Dictionary<CustomPromptAnswer>;
  type: 'free-text' | 'encoded-food';
}

export interface FreeTextFood extends AbstractFoodState {
  type: 'free-text';
  description: string;
}

export interface EncodedFood extends AbstractFoodState {
  type: 'encoded-food';
  data: UserFoodData;
  portionSizeMethodIndex: number | null;
  portionSize: PortionSizeState | null;
  associatedFoodsComplete: boolean;
}

export type FoodState = FreeTextFood | EncodedFood;

export interface FoodEntry {
  text: string;
  disabled: boolean;
}

export interface MealTime {
  hours: number;
  minutes: number;
}

export interface MealState {
  id: number;
  name: RequiredLocaleTranslation;
  defaultTime: MealTime;
  time: MealTime | undefined;
  flags: string[];
  customPromptAnswers: Dictionary<CustomPromptAnswer>;

  foods: FoodState[];
}

export interface SelectedMeal {
  type: 'meal';
  mealId: number;
}

export interface SelectedFood {
  type: 'food';
  foodId: number;
}

export type SelectionMode = 'manual' | 'auto';

export interface Selection {
  element: SelectedMeal | SelectedFood | null;
  mode: SelectionMode;
}

export type PromptAnswerResponse =
  | FoodState[]
  | string
  | FoodEntry
  | PortionSizeState
  | null
  | number;

export interface PromptAnswer {
  response: PromptAnswerResponse;
  modified: boolean;
  new: boolean;
  finished: boolean;
  prompt: ComponentType | undefined;
  mealIndex: number | undefined;
  foodIndex: number | undefined;
}

export type SurveyState = {
  schemeId: string | null;
  startTime: Date | null;
  endTime: Date | null;
  submissionTime: Date | null;
  uxSessionId: string;
  userAgent?: string | null;
  flags: string[];
  customPromptAnswers: Dictionary<CustomPromptAnswer>;
  continueButtonEnabled: boolean;
  tempPromptAnswer?: PromptAnswer;
  selection: Selection;
  meals: MealState[];
  nextFoodId: number;
  nextMealId: number;
};

export interface RecallPromptHandler {
  commitAnswer(): Promise<void>;
}

export function isSelectionEqual(s1: Selection, s2: Selection): boolean {
  if (s1.mode === s2.mode) {
    if (s1.element !== null) {
      if (s2.element === null) return false;

      if (s1.element.type === 'food' && s2.element.type === 'food')
        return s1.element.foodId === s2.element.foodId;

      if (s1.element.type === 'meal' && s2.element.type === 'meal')
        return s1.element.mealId === s2.element.mealId;

      return false;
    } else return s2.element === null;
  } else return false;
}
