import { mapState } from 'pinia';
import { defineComponent } from 'vue';

import type {
  ComponentType,
  FoodActionType,
  GenericActionType,
  MealActionType,
} from '@intake24/common/prompts';
import type { MealSection, SurveyQuestionSection } from '@intake24/common/surveys';
import type { FoodState, MealState, Selection } from '@intake24/common/types';
import type { SchemeEntryResponse } from '@intake24/common/types/http';
import type { PromptInstance } from '@intake24/survey/dynamic-recall/dynamic-recall';
import type { FoodUndo, MealUndo } from '@intake24/survey/stores';
import { isSelectionEqual } from '@intake24/common/types';
import {
  CustomPromptHandler,
  portionSizeHandlers,
  standardHandlers,
} from '@intake24/survey/components/handlers';
import { useLocale } from '@intake24/survey/composables';
import DynamicRecall from '@intake24/survey/dynamic-recall/dynamic-recall';
import { useSurvey } from '@intake24/survey/stores';
import { findMeal, getFoodIndex, getMealIndex } from '@intake24/survey/util';
import { promptType } from '@intake24/ui/util';

import { InfoAlert } from '../elements';

interface SavedState {
  prompt: PromptInstance | null;
  selection: Selection;
}

export default defineComponent({
  name: 'RecallMixin',

  components: {
    CustomPromptHandler,
    InfoAlert,
    ...standardHandlers,
    ...portionSizeHandlers,
  },

  data() {
    const { getLocaleContent } = useLocale();
    const survey = useSurvey();

    return {
      getLocaleContent,
      survey,
      currentPrompt: null as PromptInstance | null,
      recallController: null as DynamicRecall | null,
      savedState: null as SavedState | null,
      hideCurrentPrompt: false,
      // This is only required to discern between back and forward history events
      currentPromptTimestamp: 0,
    };
  },

  computed: {
    ...mapState(useSurvey, [
      'selectedMealOptional',
      'hasFinished',
      'hasMeals',
      'meals',
      'selection',
      'selectedFoodIndex',
      'selectedMealIndex',
    ]),

    handlerComponent(): string {
      const prompt = this.currentPrompt?.prompt;

      if (prompt === undefined) throw new Error('Current prompt must be defined');

      switch (prompt.type) {
        case 'custom':
          return 'custom-prompt-handler';
        case 'standard':
        case 'portion-size':
          return `${prompt.component}-handler`;
        default:
          throw new Error(`Unexpected prompt type: ${prompt.type}`);
      }
    },

    /*
     * Unique handler key to unsure handlers/prompts are reloaded between selection when using same handler/prompt
     * - not best for performance as components needs to re-render more frequently
     * - TODO: handlers/prompts should watch for selection changes and update themselves accordingly
     */
    handlerKey(): string {
      const {
        currentPrompt,
        selectedFoodIndex: { foodIndex, mealIndex } = {},
        selectedMealIndex,
      } = this;

      return [mealIndex ?? selectedMealIndex, foodIndex, currentPrompt?.prompt.id]
        .filter((item) => item !== undefined)
        .join('-');
    },

    promptName() {
      const { currentPrompt } = this;
      if (!currentPrompt) return undefined;

      const type = promptType(currentPrompt.prompt.component);

      return this.getLocaleContent(currentPrompt.prompt.i18n.name, {
        path: `prompts.${type}.name`,
      });
    },

    surveyScheme(): SchemeEntryResponse | undefined {
      return this.survey.parameters?.surveyScheme;
    },

    surveyName(): string | undefined {
      return this.survey.parameters?.name;
    },

    undo(): MealUndo | FoodUndo | null {
      return this.survey.undo;
    },

    showMealList(): boolean {
      // FIXME: decide on where to put prompts that are not connected to the main flow or refactor this.
      return (
        this.currentPrompt?.section !== 'preMeals' ||
        this.currentPrompt.prompt.component === 'meal-add-prompt'
      );
    },

    foods(): FoodState[] {
      return this.selectedMealOptional?.foods ?? [];
    },
  },

  created() {
    if (!this.surveyScheme) {
      console.error('Survey scheme must be known at this point');
      return;
    }

    window.onpopstate = this.onPopState;

    this.recallController = new DynamicRecall(this.surveyScheme, this.survey);
    this.survey.startRecall();
  },

  async mounted() {
    await this.nextPrompt();
  },

  methods: {
    onPopState(event: PopStateEvent) {
      function isValidSelection(meals: MealState[], selection: Selection): boolean {
        if (
          selection.element &&
          selection.element.type === 'meal' &&
          getMealIndex(meals, selection.element.mealId) === undefined
        ) {
          console.debug('History: meal does not exist');
          return false;
        }
        if (
          selection.element &&
          selection.element.type === 'food' &&
          getFoodIndex(meals, selection.element.foodId) === undefined
        ) {
          console.debug('History: food does not exist');
          return false;
        }
        return true;
      }

      if (
        event.state &&
        event.state.promptInstance &&
        event.state.selection &&
        event.state.timeStamp
      ) {
        const promptInstance = event.state.promptInstance as PromptInstance;
        const selection = event.state.selection as Selection;
        const timeStamp = event.state.timeStamp as number;

        console.debug(`Pop state: ${promptInstance.prompt.id}, ${JSON.stringify(selection)}`);

        if (isValidSelection(this.meals, selection)) {
          this.setSelection(selection);
          this.currentPrompt = promptInstance;
          this.currentPromptTimestamp = timeStamp;
        } else if (this.currentPromptTimestamp > timeStamp) {
          history.back();
        } else {
          history.forward();
        }
      } else {
        console.debug(`Ignoring unexpected state:`, event.state);
      }
    },

    setSelection(newSelection: Selection) {
      if (isSelectionEqual(this.survey.data.selection, newSelection)) return;

      // Prevent the currently active prompt from crashing if it expects a different selection type
      this.currentPrompt = null;
      this.survey.setSelection(newSelection);
    },

    clearUndo() {
      // FIXME: Stop components from re-rendering after clearing objectrs in vuex store.
      this.survey.clearUndo();
    },

    showMealPrompt(mealId: string, promptSection: MealSection, promptType: ComponentType) {
      this.setSelection({ element: { type: 'meal', mealId }, mode: 'manual' });

      const prompt = this.recallController
        ? this.recallController.promptManager.findMealPromptOfType(promptType, promptSection)
        : undefined;

      if (prompt === undefined)
        throw new Error(
          `Survey scheme is missing required meal (preFoods) prompt of type ${promptType}`
        );

      this.currentPrompt = { section: promptSection, prompt };
    },

    saveCurrentState() {
      // Don't save state if switching between special prompts
      if (this.savedState !== null) return;

      this.savedState = { selection: this.survey.selection, prompt: this.currentPrompt };
    },

    clearSavedState() {
      this.savedState = null;
    },

    showSurveyPrompt(promptSection: SurveyQuestionSection, promptType: ComponentType) {
      this.setSelection({ element: null, mode: 'manual' });

      const prompt = this.recallController
        ? this.recallController.promptManager.findSurveyPromptOfType(promptType, promptSection)
        : undefined;

      if (prompt === undefined)
        throw new Error(
          `Survey scheme is missing required survey (preMeals) prompt of type ${promptType}`
        );

      this.currentPrompt = { section: promptSection, prompt };
    },

    async action(type: string, id?: string) {
      switch (type) {
        case 'next':
        case 'restart':
          await this[type]();
          break;
        case 'addMeal':
        case 'review':
          this.recallAction(type);
          break;
        case 'editMeal':
        case 'mealTime':
        case 'deleteMeal':
        case 'selectMeal':
          if (id === undefined) {
            console.warn('Recall: Meal id must be defined for meal action.', type, id);
            return;
          }

          this.mealAction(type, id);
          break;
        case 'deleteFood':
        case 'editFood':
        case 'selectFood':
          if (id === undefined) {
            console.warn('Recall: Food id must be defined for food action.', type, id);
            return;
          }

          this.foodAction(type, id);
          break;
        default:
          console.warn(`Recall: Unknown action type: ${type}`);
      }
    },

    async mealAction(type: MealActionType, mealId: string) {
      switch (type) {
        case 'editMeal':
          this.showMealPrompt(mealId, 'preFoods', 'edit-meal-prompt');
          break;
        case 'mealTime':
          this.showMealPrompt(mealId, 'preFoods', 'meal-time-prompt');
          break;
        case 'deleteMeal':
          this.survey.deleteMeal(mealId);
          await this.nextPrompt();
          break;
        case 'selectMeal':
          this.setSelection({ element: { type: 'meal', mealId }, mode: 'manual' });
          await this.nextPrompt();
          break;
        default:
          console.warn(`Recall: Unknown action type: ${type}`);
      }
    },

    async foodAction(type: FoodActionType, foodId: string) {
      switch (type) {
        case 'editFood':
          this.survey.editFood(foodId);
          await this.nextPrompt();
          break;
        case 'deleteFood':
          this.survey.deleteFood(foodId);
          await this.nextPrompt();
          break;
        case 'selectFood':
          this.setSelection({ element: { type: 'food', foodId }, mode: 'manual' });
          await this.nextPrompt();
          break;
        default:
          console.warn(`Recall: Unknown action type: ${type}`);
      }
    },

    recallAction(action: GenericActionType) {
      if (this.hasFinished) return;

      switch (action) {
        case 'addMeal':
          this.showSurveyPrompt('preMeals', 'meal-add-prompt');
          break;
        case 'review':
          this.saveCurrentState();
          this.showSurveyPrompt('submission', 'review-confirm-prompt');
          break;
        // TODO: is this needed?
        case 'no-more-information':
          this.saveCurrentState();
          this.showMealPrompt('0', 'postFoods', 'no-more-information-prompt');
          break;
      }
    },

    isSavedStateValid(): boolean {
      if (this.savedState == null) return false;

      const selection = this.savedState.selection;

      // No element selected means only survey prompts are applicable
      // that are always valid
      if (selection.element == null) return true;

      // Otherwise, make sure selected element id is still valid (it could have been
      // deleted since the state was saved)
      if (selection.element.type == 'food')
        return getFoodIndex(this.survey.meals, selection.element.foodId) !== undefined;
      else return getMealIndex(this.survey.meals, selection.element.mealId) !== undefined;
    },

    async nextPrompt() {
      // Special-case prompts like the mobile review save the current state when they are triggered
      // by user actions.

      // If a saved state exists, then use it as the next prompt (i.e., go back to the prompt that
      // was active before.

      if (this.savedState != null && this.isSavedStateValid()) {
        console.debug(`Using saved state ${this.savedState.prompt?.prompt.component}`);
        this.setSelection(this.savedState.selection);
        this.currentPrompt = this.savedState.prompt;
        this.savedState = null;
      } else {
        this.savedState = null;

        const nextPrompt = this.recallController
          ? this.recallController.getNextPrompt()
          : undefined;

        if (nextPrompt === undefined) {
          // TODO: handle completion
          console.log('No prompts remaining');
          if (this.hasMeals) {
            this.recallAction('addMeal');
          } else {
            this.currentPrompt = null;
          }
        } else {
          console.debug(
            `Switching prompt to: ${nextPrompt.prompt.id} (${nextPrompt.prompt.component})`
          );

          this.currentPrompt = nextPrompt;
          this.currentPromptTimestamp = Date.now();

          // Strip Vue reactivity wrappers
          const promptInstance = JSON.parse(JSON.stringify(this.currentPrompt));
          const selection = JSON.parse(JSON.stringify(this.selection));
          const timeStamp = JSON.parse(JSON.stringify(this.currentPromptTimestamp));

          if (selection.element !== null && promptInstance) {
            console.debug(
              `Push state: ${promptInstance.prompt.id}, selection: ${JSON.stringify(selection)}`
            );
            history.pushState({ promptInstance, selection, timeStamp }, '', window.location.href);
          }
        }
      }
    },

    async next() {
      // Workaround for a crash that occurs if the currently selected prompt changes something
      // in the recall data that makes it incompatible, for example changing from 'free-text'
      // food entry type to 'encoded-food' in commitAnswer.
      //
      // In the current implementation an update/render event is triggered before the nextPrompt
      // function is executed, because most prompts have a reactive dependency on the currently
      // selected food.
      //
      // The correct implementation would be re-evaluating the current prompt type immediately
      // (via the reactivity system) in response to changes in commitAnswer.
      this.hideCurrentPrompt = true;

      await this.nextPrompt();

      this.hideCurrentPrompt = false;
    },

    async restart() {
      this.currentPrompt = null;
      useSurvey().cancelRecall();
      await this.$router.push({
        name: 'survey-home',
        params: { surveyId: this.$route.params.surveyId },
      });
    },
  },
});
