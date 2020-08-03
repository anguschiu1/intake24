import Vue from 'vue';
import { LocaleTranslation } from '@common/types/common';
import { LocaleOptionList } from '@common/types/promptProps';
import prompt from './Prompt';
import PromptListOptions from './PromptListOptions.vue';
import SelectLocale from './SelectLocale.vue';

export default Vue.extend({
  name: 'SelectListPrompt',

  components: { PromptListOptions, SelectLocale },

  mixins: [prompt],

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
