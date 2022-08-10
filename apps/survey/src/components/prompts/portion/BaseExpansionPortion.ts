import { defineComponent } from 'vue';

import ValidInvalidIcon from '@intake24/survey/components/elements/ValidInvalidIcon.vue';
import PortionLayout from '@intake24/survey/components/layouts/PortionLayout.vue';
import { localeContent } from '@intake24/survey/components/mixins';
import expansionPanelControls from '@intake24/survey/components/mixins/expansionPanelControls';
import Continue from '@intake24/survey/components/prompts/actions/Continue.vue';

export default defineComponent({
  components: { Continue, PortionLayout, ValidInvalidIcon },

  mixins: [localeContent, expansionPanelControls],
});
