import type { SetupContext } from 'vue';
import { computed, ref } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import type { EncodedFood, FoodState, PartialRecord, RecipeBuilder } from '@intake24/common/types';
import type { LocaleContentOptions } from '@intake24/i18n';
import { useI18n } from '@intake24/i18n';
import { useSurvey } from '@intake24/survey/stores';
import { promptType } from '@intake24/ui';

import type { UseFoodUtilsProps } from './use-food-utils';
import type { UseMealUtilsProps } from './use-meal-utils';
import { useFoodUtils } from './use-food-utils';
import { useMealUtils } from './use-meal-utils';

export type UsePromptPropsBase<P extends keyof Prompts> = {
  prompt: Prompts[P];
  section: PromptSection;
};

export type UsePromptProps<
  P extends keyof Prompts,
  F extends FoodState | undefined,
  FP extends EncodedFood | RecipeBuilder | undefined,
> = UsePromptPropsBase<P> & UseFoodUtilsProps<F, FP> & UseMealUtilsProps;

export const usePromptUtils = <
  P extends keyof Prompts,
  F extends FoodState | undefined,
  FP extends EncodedFood | RecipeBuilder | undefined,
>(
  props: UsePromptProps<P, F, FP>,
  { emit }: SetupContext<any>,
  confirmCallback?: () => boolean
) => {
  const { i18n } = useI18n();
  const survey = useSurvey();
  const { mealName, mealTime } = useMealUtils(props);
  const { foodName } = useFoodUtils(props);

  const isFood = computed(() => !!props.food && !!props.meal);

  const isMeal = computed(() => !!props.meal && !props.food);

  const foodOrMealName = computed(() => foodName.value ?? mealName.value ?? '');

  const errors = ref<string[]>([]);
  const hasErrors = computed(() => !!errors.value.length);
  const clearErrors = () => {
    errors.value = [];
  };

  const type = computed(() => promptType(props.prompt.component));

  const recipeBuilderEnabled = computed(() =>
    survey.registeredPortionSizeMethods.includes('recipe-builder-prompt')
  );

  const params = computed(() => {
    const build: Record<string, string> = {};

    if (foodName.value) {
      if (isFood.value) build.item = foodName.value;

      build.food = foodName.value;
    }

    if (mealName.value) {
      build.mealName = mealName.value;

      if (mealTime.value) {
        build.mealTime = mealTime.value;

        const meal = `${mealName.value} (${mealTime.value})`;
        if (isMeal.value) build.item = meal;

        build.meal = meal;
      } else {
        if (isMeal.value) build.item = mealName.value;
        build.meal = mealName.value;
      }
    }

    return build;
  });

  const translatePrompt = <T extends string>(
    keys: T[],
    params: PartialRecord<T, LocaleContentOptions['params']> = {}
  ) => {
    return keys.reduce(
      (acc, key) => {
        acc[key] = i18n.t(`prompts.${type.value}.${key}`, params[key] ?? {}).toString();
        return acc;
      },
      {} as Record<T, string>
    );
  };

  const action = (type: string, ...args: [id?: string, params?: object]) => {
    if (type !== 'next') {
      emit('action', type, ...args);
      return;
    }

    if (confirmCallback && !confirmCallback()) return;

    emit('action', type, ...args);
  };

  return {
    action,
    clearErrors,
    errors,
    foodName,
    foodOrMealName,
    hasErrors,
    isFood,
    isMeal,
    mealName,
    params,
    recipeBuilderEnabled,
    translatePrompt,
    type,
  };
};
