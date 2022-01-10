import Vue from 'vue';
import { LocaleOptionList } from '@intake24/common/prompts';
import { LocaleTranslation } from '@intake24/common/types';
import basePrompt from './base-prompt';
import PromptListOptions from './prompt-list-options.vue';
import LanguageSelector from './language-selector.vue';

export default Vue.extend({
  name: 'SelectListPrompt',

  components: { PromptListOptions, LanguageSelector },

  mixins: [basePrompt],

  props: {
    options: {
      type: Object as () => LocaleOptionList,
    },
    label: {
      type: Object as () => LocaleTranslation,
    },
    other: {
      type: Boolean,
      default: true,
    },
  },
});
