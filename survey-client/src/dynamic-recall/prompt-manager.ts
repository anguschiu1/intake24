import { Condition, conditionOps, PromptQuestion } from '@common/prompts';
import { SurveyState } from '@/types/vuex';
import { SchemeEntryResponse } from '@common/types/http';

function checkRecallNumber(state: SurveyState, condition: Condition) {
  if (state.user == null) {
    console.error('User information should not be null at this point');
    return false;
  }
  return conditionOps[condition.op]([condition.value, state.user.recallNumber]);
}

// function showPrompt(state: SurveyState, prompt: PromptQuestion){

// }

function checkSurveyStandardConditions(state: SurveyState, prompt: PromptQuestion): boolean {
  if (state.data == null) {
    console.error(`Survey data should not be null at this point`);
    return false;
  }

  switch (prompt.component) {
    case 'info-prompt':
      return !state.data.flags.includes(`${prompt.id}-acknowledged`);
    default:
      return state.data.customPromptAnswers[prompt.id] === undefined;
  }
}

function checkSurveyCustomConditions(state: SurveyState, prompt: PromptQuestion) {
  return prompt.props.conditions.every((condition) => {
    switch (condition.type) {
      case 'surveyPromptAnswer':
        if (state.data == null) {
          console.error('Survey data should not be null at this point');
          return false;
        }
        return conditionOps[condition.op]([
          condition.value,
          state.data.customPromptAnswers[condition.props.promptId],
        ]);
      case 'recallNumber':
        return checkRecallNumber(state, condition);
      default:
        console.error(`Unexpected condition type: ${condition.type}`);
        return false;
    }
  });
}

function checkMealStandardConditions(
  state: SurveyState,
  mealIndex: number,
  prompt: PromptQuestion
): boolean {
  if (state.data == null) {
    console.error(`Survey data should not be null at this point`);
    return false;
  }

  if (prompt.component === 'meal-time-prompt') {
    return state.data.meals[mealIndex].time === undefined;
  }

  switch (prompt.component) {
    case 'info-prompt':
      return !state.data.meals[mealIndex].flags.includes(`${prompt.id}-acknowledged`);
    default:
      return state.data.meals[mealIndex].customPromptAnswers[prompt.id] === undefined;
  }
}

function checkMealCustomConditions(state: SurveyState, mealIndex: number, prompt: PromptQuestion) {
  return prompt.props.conditions.every((condition) => {
    switch (condition.type) {
      case 'surveyPromptAnswer':
        if (state.data == null) {
          console.error('Survey data should not be null at this point');
          return false;
        }
        return conditionOps[condition.op]([
          condition.value,
          state.data.customPromptAnswers[condition.props.promptId],
        ]);
      case 'mealPromptAnswer':
        if (state.data == null) {
          console.error('Survey data should not be null at this point');
          return false;
        }
        return conditionOps[condition.op]([
          condition.value,
          state.data.meals[mealIndex].customPromptAnswers[condition.props.promptId],
        ]);
      case 'recallNumber':
        return checkRecallNumber(state, condition);
      default:
        console.error(`Unexpected condition type: ${condition.type}`);
        return false;
    }
  });
}

function checkFoodStandardConditions(
  state: SurveyState,
  mealIndex: number,
  foodIndex: number,
  prompt: PromptQuestion
): boolean {
  if (state.data == null) {
    console.error(`Survey data should not be null at this point`);
    return false;
  }

  if (prompt.component === 'food-search-prompt') {
    return state.data.meals[mealIndex].foods[foodIndex].type === 'free-text';
  }

  switch (prompt.component) {
    case 'info-prompt':
      return !state.data.meals[mealIndex].foods[foodIndex].flags.includes(
        `${prompt.id}-acknowledged`
      );
    default:
      return (
        state.data.meals[mealIndex].foods[foodIndex].customPromptAnswers[prompt.id] === undefined
      );
  }
}

function checkFoodCustomConditions(
  state: SurveyState,
  mealIndex: number,
  foodIndex: number,
  prompt: PromptQuestion
) {
  return prompt.props.conditions.every((condition) => {
    switch (condition.type) {
      case 'surveyPromptAnswer':
        if (state.data == null) {
          console.error('Survey data should not be null at this point');
          return false;
        }
        return conditionOps[condition.op]([
          condition.value,
          state.data.customPromptAnswers[condition.props.promptId],
        ]);
      case 'mealPromptAnswer':
        if (state.data == null) {
          console.error('Survey data should not be null at this point');
          return false;
        }
        return conditionOps[condition.op]([
          condition.value,
          state.data.meals[mealIndex].customPromptAnswers[condition.props.promptId],
        ]);
      case 'foodPromptAnswer':
        if (state.data == null) {
          console.error('Survey data should not be null at this point');
          return false;
        }
        return conditionOps[condition.op]([
          condition.value,
          state.data.meals[mealIndex].foods[foodIndex].customPromptAnswers[
            condition.props.promptId
          ],
        ]);
      case 'recallNumber':
        return checkRecallNumber(state, condition);
      default:
        console.error(`Unexpected condition type: ${condition.type}`);
        return false;
    }
  });
}

export default class PromptManager {
  private surveyScheme: SchemeEntryResponse;

  constructor(scheme: SchemeEntryResponse) {
    this.surveyScheme = scheme;
  }

  nextPreMealsPrompt(state: SurveyState): PromptQuestion | undefined {
    return this.surveyScheme.questions.preMeals.find((question) => {
      return (
        checkSurveyStandardConditions(state, question) &&
        checkSurveyCustomConditions(state, question)
      );
    });
  }

  nextPreFoodsPrompt(state: SurveyState, mealIndex: number): PromptQuestion | undefined {
    return this.surveyScheme.questions.meals.preFoods.find((question) => {
      return (
        checkMealStandardConditions(state, mealIndex, question) &&
        checkMealCustomConditions(state, mealIndex, question)
      );
    });
  }

  nextFoodsPrompt(
    state: SurveyState,
    mealIndex: number,
    foodIndex: number
  ): PromptQuestion | undefined {
    return this.surveyScheme.questions.meals.foods.find((question) => {
      return (
        checkFoodStandardConditions(state, mealIndex, foodIndex, question) &&
        checkFoodCustomConditions(state, mealIndex, foodIndex, question)
      );
    });
  }
}
