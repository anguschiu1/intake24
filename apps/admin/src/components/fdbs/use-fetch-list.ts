import type { Ref } from 'vue';
import debounce from 'lodash/debounce';
import { ref, unref, watch } from 'vue';

import { httpService } from '@intake24/admin/services';

export const useFetchList = <T = any>(url: string, id: string | Ref<string>) => {
  const dialog = ref(false);
  const loading = ref(false);
  const search = ref<string | null>(null);
  const items = ref<T[]>([]);

  const debouncedFetch = debounce(() => {
    fetch();
  }, 500);

  const fetch = async () => {
    loading.value = true;

    try {
      const {
        data: { data },
      } = await httpService.get(url.replace(':id', unref(id)), {
        params: { search: search.value, limit: 5 },
      });

      items.value = data;
    } finally {
      loading.value = false;
    }
  };

  const clear = async () => {
    search.value = null;
    await fetch();
  };

  watch(dialog, async (val) => {
    if (val && !items.value.length) await fetch();
  });

  watch(search, () => {
    debouncedFetch();
  });

  return {
    dialog,
    loading,
    search,
    items,
    fetch,
    clear,
  };
};
