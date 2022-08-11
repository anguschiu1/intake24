import type { Selection } from '@intake24/common/types';
import type PromptManager from '@intake24/survey/dynamic-recall/prompt-manager';
import { getMealIndexRequired } from '@intake24/survey/stores/meal-food-utils';

import type { SurveyStore } from '../stores';

export default class SelectionManager {
  private store;

  private promptManager;

  constructor(store: SurveyStore, promptManager: PromptManager) {
    this.store = store;
    this.promptManager = promptManager;
  }

  private mealPromptsAvailable(mealId: number): boolean {
    return (
      this.promptManager.nextMealSectionPrompt(this.store.$state, 'preFoods', mealId) !== undefined
    );
  }

  private foodPromptsAvailable(foodId: number): boolean {
    return this.promptManager.nextFoodsPrompt(this.store.$state, foodId) !== undefined;
  }

  private tryAnyFood(mealId: number): Selection | undefined {
    // FIXME: linked foods
    const { currentState } = this.store;
    const mealIndex = getMealIndexRequired(currentState.meals, mealId);

    for (let foodIndex = 0; foodIndex < currentState.meals[mealIndex].foods.length; ++foodIndex) {
      const foodId = currentState.meals[mealIndex].foods[foodIndex].id;
      if (this.foodPromptsAvailable(foodId))
        return {
          element: {
            type: 'food',
            foodId,
          },
          mode: 'auto',
        };
    }

    return undefined;
  }

  private tryFoodInAnyMeal(): Selection | undefined {
    const { currentState } = this.store;

    for (let mealIndex = 0; mealIndex < currentState.meals.length; mealIndex++) {
      const selection = this.tryAnyFood(currentState.meals[mealIndex].id);

      if (selection !== undefined) return selection;
    }
    return undefined;
  }

  private tryAnyMeal(): Selection | undefined {
    const { currentState } = this.store;

    for (let mealIndex = 0; mealIndex < currentState.meals.length; mealIndex++) {
      const mealId = currentState.meals[mealIndex].id;

      if (this.mealPromptsAvailable(mealId))
        return {
          element: {
            type: 'meal',
            mealId,
          },
          mode: 'auto',
        };
    }
    return undefined;
  }

  nextSelection(): Selection {
    return this.tryFoodInAnyMeal() ?? this.tryAnyMeal() ?? { mode: 'auto', element: null };
  }
}
