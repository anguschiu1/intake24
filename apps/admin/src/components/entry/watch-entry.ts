import { defineComponent } from 'vue';
import type { NavigationGuardNext, Route } from 'vue-router';
import { copy } from '@intake24/common/util';

export default defineComponent({
  name: 'WatchEntry',

  data() {
    return {
      originalEntry: null as any,
      routeLeave: {
        dialog: false,
        to: null as Route | null,
        confirmed: false,
      },
    };
  },

  beforeRouteUpdate(to, from, next) {
    this.beforeRouteCheck(to, from, next);
  },

  beforeRouteLeave(to, from, next) {
    this.beforeRouteCheck(to, from, next);
  },

  computed: {
    /*
     * Override and implement logic in component
     */
    entryChanged(): boolean {
      return false;
    },
  },

  methods: {
    setOriginalEntry(data: any) {
      this.originalEntry = copy(data);
    },

    beforeRouteCheck(to: Route, from: Route, next: NavigationGuardNext) {
      if (this.routeLeave.confirmed) {
        this.routeLeave = { dialog: false, to: null, confirmed: false };
        next();
        return;
      }

      if (this.entryChanged) {
        this.routeLeave = { dialog: true, to, confirmed: false };
        return;
      }

      next();
    },
  },
});
