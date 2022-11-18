import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Actions, Condition, PromptValidationProps } from '@intake24/common/prompts';
import type { LocaleTranslation } from '@intake24/common/types';

import PromptActions from './prompt-actions.vue';
import PromptConditions from './prompt-conditions.vue';
import PromptContent from './prompt-content.vue';
import PromptValidation from './prompt-validation.vue';

export type LocaleTranslationKeys =
  | 'name'
  | 'text'
  | 'description'
  | 'label'
  | 'actions'
  | 'conditions'
  | 'options';

export default defineComponent({
  name: 'BasePrompt',

  components: { PromptActions, PromptContent, PromptConditions, PromptValidation },

  props: {
    name: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    text: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    description: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    actions: {
      type: Object as PropType<Actions>,
    },
    conditions: {
      type: Array as PropType<Condition[]>,
      required: true,
    },
    validation: {
      type: Object as PropType<PromptValidationProps>,
    },
  },

  methods: {
    update(field: string, value: any) {
      this.$emit(`update:${field}`, value);
    },
    updateLanguage(field: LocaleTranslationKeys, lang: string, value: any) {
      this.$emit(`update:${field}`, { ...this.$props[field], [lang]: value });
    },
  },
});
