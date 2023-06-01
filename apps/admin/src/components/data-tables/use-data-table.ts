import type { ComputedRef, Ref } from 'vue';
import type { DataOptions } from 'vuetify';
import { deepEqual } from 'fast-equals';
import { computed, onMounted, ref, watch } from 'vue';

import type { Dictionary } from '@intake24/common/types';
import type { Pagination, PaginationMeta } from '@intake24/db';
import { useHttp } from '@intake24/admin/services';
import { useResource } from '@intake24/admin/stores';

export type DataTableProps = {
  apiUrl?: string;
  headers: string[];
  trackBy: string;
};

export const useDataTable = (
  props: DataTableProps,
  filter: ComputedRef<Dictionary> | Ref<Dictionary>
) => {
  const http = useHttp();
  const resource = useResource();

  const api = computed(() => props.apiUrl ?? resource.api);

  const items = ref<Dictionary[]>([]);
  const meta = ref<Partial<PaginationMeta>>({ total: 0 });
  const options = ref<DataOptions>({} as DataOptions);
  const selected = ref<Dictionary[]>([]);

  const tracked = computed<string[] | number[]>(() =>
    selected.value.map((item) => item[props.trackBy])
  );

  const fetch = async () => {
    const {
      page,
      itemsPerPage: limit,
      sortBy: [column],
      sortDesc: [desc],
    } = options.value;

    const sort = column ? `${column}|${desc ? 'desc' : 'asc'}` : undefined;

    const { data } = await http.get<Pagination>(api.value, {
      params: { limit, page, sort, ...filter.value },
      withLoading: true,
    });

    items.value = data.data;
    meta.value = { ...data.meta };
  };

  watch(
    () => options,
    async (val, oldVal) => {
      if (deepEqual(val, oldVal)) return;

      await fetch();
    },
    { deep: true }
  );

  onMounted(async () => {
    await fetch();
  });

  return { api, fetch, items, meta, options, selected, tracked };
};
