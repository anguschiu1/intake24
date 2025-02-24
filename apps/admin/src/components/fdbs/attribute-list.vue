<template>
  <v-card border flat>
    <v-toolbar color="grey-lighten-4">
      <v-toolbar-title class="font-weight-medium">
        {{ $t('fdbs.attributes.title') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-row>
        <v-col cols="auto">
          <v-btn :disabled="disabled" variant="outlined" @click="toggleInherit('sameAsBeforeOption')">
            {{ title('sameAsBeforeOption') }}
          </v-btn>
        </v-col>
        <v-col align-self="center">
          <v-switch
            v-model="attributes.sameAsBeforeOption"
            class="mt-0"
            :disabled="disabled || isInherited('sameAsBeforeOption')"
            :error-messages="errors.get('main.attributes.sameAsBeforeOption')"
            hide-details="auto"
            :label="$t('fdbs.attributes.sameAsBeforeOption')"
            name="attributes.sameAsBeforeOption"
            @update:model-value="errors.clear('main.attributes.sameAsBeforeOption')"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col align-self="center" cols="auto">
          <v-btn :disabled="disabled" variant="outlined" @click="toggleInherit('readyMealOption')">
            {{ title('readyMealOption') }}
          </v-btn>
        </v-col>
        <v-col align-self="center">
          <v-switch
            v-model="attributes.readyMealOption"
            class="mt-0"
            :disabled="disabled || isInherited('readyMealOption')"
            :error-messages="errors.get('main.attributes.readyMealOption')"
            hide-details="auto"
            :label="$t('fdbs.attributes.readyMealOption')"
            name="attributes.readyMealOption"
            @update:model-value="errors.clear('main.attributes.readyMealOption')"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col align-self="center" cols="auto">
          <v-btn :disabled="disabled" variant="outlined" @click="toggleInherit('reasonableAmount')">
            {{ title('reasonableAmount') }}
          </v-btn>
        </v-col>
        <v-col align-self="center">
          <v-text-field
            v-model.number="attributes.reasonableAmount"
            density="compact"
            :disabled="disabled || isInherited('reasonableAmount')"
            :error-messages="errors.get('main.attributes.reasonableAmount')"
            hide-details="auto"
            :label="$t('fdbs.attributes.reasonableAmount')"
            name="attributes.reasonableAmount"
            variant="outlined"
            @update:model-value="errors.clear('main.attributes.reasonableAmount')"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col align-self="center" cols="auto">
          <v-btn :disabled="disabled" variant="outlined" @click="toggleInherit('useInRecipes')">
            {{ title('useInRecipes') }}
          </v-btn>
        </v-col>
        <v-col align-self="center" cols>
          <v-select
            v-model="attributes.useInRecipes"
            density="compact"
            :disabled="disabled || isInherited('useInRecipes')"
            :error-messages="errors.get('main.attributes.useInRecipes')"
            hide-details="auto"
            :items="useInRecipeTypeItems"
            :label="$t('fdbs.attributes.useInRecipes._')"
            name="attributes.useInRecipes"
            variant="outlined"
            @update:model-value="errors.clear('main.attributes.useInRecipes')"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { ReturnUseErrors } from '@intake24/admin/composables/use-errors';
import type { Nullable } from '@intake24/common/types';
import { useInRecipeTypes } from '@intake24/common/types';
import type { AttributeDefaultsAttributes } from '@intake24/db';
import { useI18n } from '@intake24/i18n';

type Attributes = Pick<
  AttributeDefaultsAttributes,
  'sameAsBeforeOption' | 'readyMealOption' | 'reasonableAmount' | 'useInRecipes'
>;

type AttributeType = keyof Attributes;

const defaultAttributes: Attributes = {
  sameAsBeforeOption: false,
  readyMealOption: false,
  reasonableAmount: 0,
  useInRecipes: 0,
};

export default defineComponent({
  name: 'AttributeList',

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Object as PropType<ReturnUseErrors>,
      required: true,
    },
    modelValue: {
      type: Object as PropType<Nullable<Attributes>>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const { i18n } = useI18n();

    const attributes = computed({
      get() {
        return props.modelValue;
      },
      set(val) {
        emit('update:modelValue', val);
      },
    });

    const useInRecipeTypeItems = computed(() =>
      Object.values(useInRecipeTypes).map(value => ({
        value,
        title: i18n.t(`fdbs.attributes.useInRecipes.${value}`),
      })),
    );

    function isInherited(attribute: AttributeType) {
      return attributes.value[attribute] === null;
    };

    function title(attribute: AttributeType): string {
      const key = attributes.value[attribute] === null ? 'override' : 'inherit';
      return i18n.t(`fdbs.attributes.${key}`);
    };

    function toggleInherit(attribute: AttributeType) {
      if (attributes.value[attribute] !== null) {
        attributes.value[attribute] = null;
        return;
      }

      // @ts-expect-error it doesn't narrow the type correctly
      this.attributes[attribute] = this.defaultAttributes[attribute];
    };

    return {
      attributes,
      defaultAttributes,
      isInherited,
      title,
      toggleInherit,
      useInRecipeTypeItems,
    };
  },
});
</script>
