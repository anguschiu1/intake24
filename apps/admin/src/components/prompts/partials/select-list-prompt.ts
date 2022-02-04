import { defineComponent, PropType } from '@vue/composition-api';
import { LocaleOptionList } from '@intake24/common/prompts';
import { LocaleTranslation } from '@intake24/common/types';
import { LanguageSelector } from '@intake24/admin/components/forms';
import basePrompt from './base-prompt';
import PromptListOptions from './prompt-list-options.vue';

export default defineComponent({
  name: 'SelectListPrompt',

  components: { PromptListOptions, LanguageSelector },

  mixins: [basePrompt],

  props: {
    options: {
      type: Object as PropType<LocaleOptionList>,
      required: true,
    },
    label: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    other: {
      type: Boolean,
      default: true,
    },
  },
});
