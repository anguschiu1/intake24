import type { PropType } from 'vue';
import set from 'lodash/set';
import { computed, defineComponent, onBeforeMount } from 'vue';

import type { ActionItem, Prompt } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import type { FoodState, MealState } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';
import { useFoodUtils, useMealUtils, usePromptUtils } from '@intake24/survey/composables';
import { useSurvey } from '@intake24/survey/stores';

import { Next } from '../actions';
import Breadcrumbs from './breadcrumbs.vue';

export default defineComponent({
  name: 'LayoutMixin',

  components: { Next, Breadcrumbs },

  props: {
    prompt: {
      type: Object as PropType<Prompt>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
    food: {
      type: Object as PropType<FoodState>,
    },
    meal: {
      type: Object as PropType<MealState>,
    },
    isValid: {
      type: Boolean,
      default: false,
    },
    navTab: {
      type: String,
      default: 'next',
    },
  },

  emits: ['action', 'update:navTab'],

  setup(props, { emit }) {
    const { i18n, translate, translatePath } = useI18n();
    const { params, type } = usePromptUtils(props);
    const { foodName } = useFoodUtils(props);
    const { mealName, mealTime, mealNameWithTime } = useMealUtils(props);
    const survey = useSurvey();

    const showSummary = computed(() => {
      if (survey.hasFinished) return false;

      return !['preMeals'].includes(props.section);
    });

    const loadPromptTranslations = () => {
      if (!Object.keys(props.prompt.i18n).length) return;

      const locale = i18n.locale;
      const messages = i18n.getLocaleMessage(locale);

      Object.entries(props.prompt.i18n).forEach(([key, value]) => {
        if (!value[locale]) return;

        set(messages, `prompts.${type.value}.${key}`, value[locale]);
      });

      i18n.setLocaleMessage(locale, messages);
    };

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      emit('action', type, ...args);
    };

    onBeforeMount(() => {
      loadPromptTranslations();
    });

    return {
      action,
      foodName,
      translate,
      translatePath,
      mealName,
      mealTime,
      mealNameWithTime,
      params,
      showSummary,
      type,
      meals: survey.data.meals,
    };
  },

  computed: {
    foodOrMealId() {
      return this.food?.id ?? this.meal?.id;
    },

    desktopActions(): ActionItem[] {
      return this.prompt.actions?.items.filter((action) => action.layout.includes('desktop')) ?? [];
    },

    hasDefaultSlot(): boolean {
      return !!this.$slots.default;
    },

    hasActionsSlot(): boolean {
      return !!this.$slots.actions;
    },

    hasNavActionsSlot(): boolean {
      return !!this.$slots['nav-actions'];
    },

    mobileActions(): ActionItem[] {
      return this.prompt.actions?.items.filter((action) => action.layout.includes('mobile')) ?? [];
    },

    i18n() {
      return {
        name: this.$t(`prompts.${this.type}.name`, this.params),
        text: this.$t(`prompts.${this.type}.text`, this.params),
        description: this.translatePath(`prompts.${this.type}.description`, this.params, true),
      };
    },
  },
});
