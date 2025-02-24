<template>
  <portion-size-option-prompt
    v-model="state"
    v-bind="{
      availableMethods,
      food,
      meal,
      parentFood,
      prompt,
      section,
    }"
    @action="action"
    @update:model-value="update"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { EncodedFood, PortionSizeMethodId, PromptSection } from '@intake24/common/surveys';
import { PortionSizeOptionPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

const parentFoodRequiredPSMs: PortionSizeMethodId[] = [
  'milk-in-a-hot-drink',
  'parent-food-portion',
];

export default defineComponent({
  name: 'PortionSizeOptionPromptHandler',

  components: { PortionSizeOptionPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['portion-size-option-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, ctx) {
    const { encodedFood, parentFoodOptional: parentFood } = useFoodPromptUtils();
    const { meal } = useMealPromptUtils();

    const food = encodedFood();

    const getInitialState = (): PromptStates['portion-size-option-prompt'] => ({
      option: food.portionSizeMethodIndex,
    });

    const commitAnswer = () => {
      const update: Partial<Omit<EncodedFood, 'type'>> = {
        portionSizeMethodIndex: state.value.option,
      };

      if (
        food.portionSizeMethodIndex !== null
        && food.portionSizeMethodIndex !== state.value.option
      ) {
        update.portionSize = null;
      }

      survey.updateFood({ foodId: food.id, update });
      survey.addFoodFlag(food.id, 'portion-size-option-complete');

      clearStoredState();
    };

    const { state, action, update, clearStoredState } = usePromptHandlerStore(
      props,
      ctx,
      getInitialState,
      commitAnswer,
    );

    const survey = useSurvey();

    const availableMethods = computed(() =>
      food.data.portionSizeMethods.map((item, index) => ({
        ...item,
        index,
      })).filter(
        item =>
          survey.registeredPortionSizeMethods.includes(item.method)
          && (!parentFoodRequiredPSMs.includes(item.method) || !!parentFood.value),
      ),
    );

    return {
      food,
      meal,
      parentFood,
      state,
      update,
      action,
      availableMethods,
    };
  },
});
</script>
