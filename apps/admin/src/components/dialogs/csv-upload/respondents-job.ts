import { defineComponent } from 'vue';

import { PollsForJobs } from '@intake24/admin/components/jobs';

export default defineComponent({
  name: 'RespondentJobsMixin',

  mixins: [PollsForJobs],

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      dialog: false,
    };
  },

  watch: {
    async dialog(val: boolean) {
      if (!val) {
        this.stopPolling();
        return;
      }

      await this.status();
    },
  },

  methods: {
    close() {
      this.dialog = false;
    },
  },
});
