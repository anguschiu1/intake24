import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import type { EncodedFood, LocaleTranslation } from '@intake24/common/types';
import type { UserPortionSizeMethod } from '@intake24/common/types/http';
import { useSurvey } from '@intake24/survey/stores';

export interface PromptStateEvents<T> {
  update(newValue: T): void;
  complete(): void;
}

export default defineComponent({
  computed: {
    ...mapState(useSurvey, ['selectedFood', 'selectedMealIndex', 'selectedFoodIndex']),

    encodedSelectedFood(): EncodedFood {
      const { selectedFood } = this;

      if (selectedFood === undefined) throw new Error('This prompt requires a food to be selected');

      if (selectedFood.type !== 'encoded-food')
        throw new Error('This selected food must be an encoded food');

      return selectedFood;
    },

    // FIXME: local food names need to be returned for all locales from food data service,
    // en is hard-coded for now
    foodName(): LocaleTranslation {
      return {
        en: this.encodedSelectedFood.data.englishName,
      };
    },

    selectedPortionSize(): UserPortionSizeMethod {
      const selectedFood = this.encodedSelectedFood;

      if (selectedFood.portionSizeMethodIndex === null)
        throw new Error('This prompt requires a portion size option to be selected');

      return selectedFood.data.portionSizeMethods[selectedFood.portionSizeMethodIndex];
    },
  },
});
