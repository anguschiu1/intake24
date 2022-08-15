import type { PropType } from 'vue';
import isEqual from 'lodash/isEqual';
import { defineComponent } from 'vue';

import type { PortionSizeMethodParameterItem } from '..';
import SelectResourceDialog from '../select-resource-dialog.vue';

export default defineComponent({
  name: 'SelectsResource',

  props: {
    value: {
      type: Array as PropType<PortionSizeMethodParameterItem[]>,
      required: true,
    },
  },

  components: { SelectResourceDialog },

  data() {
    return { items: [...this.value] };
  },

  watch: {
    value(val) {
      if (isEqual(val, this.items)) return;

      this.items = [...val];
    },
    items() {
      this.$emit('input', this.items);
    },
  },

  methods: {
    getParameter(name: string) {
      return this.items.find((item) => item.name === name);
    },
    setParameter(name: string, value: string) {
      const item = this.items.find((item) => item.name === name);
      if (item) {
        item.value = value;
        return;
      }

      this.items.push({ name, value });
    },
    removeParameter(name: string) {
      this.items = this.items.filter((item) => item.name !== name);
    },
  },
});
