import Vue from 'vue';
import { mapGetters } from 'vuex';
import { EncodedFood, LocaleTranslation } from '@common/types';
import { UserPortionSizeMethod } from '@common/types/http';

export default Vue.extend({
  computed: {
    ...mapGetters('survey', ['selectedFood', 'selectedMealIndex', 'selectedFoodIndex']),

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
        en: this.encodedSelectedFood.data.englishDescription,
      };
    },

    selectedPortionSize(): UserPortionSizeMethod {
      const selectedFood = this.encodedSelectedFood;

      if (selectedFood.portionSizeMethodIndex == null)
        throw new Error('This prompt requires a portion size option to be selected');

      return selectedFood.data.portionSizeMethods[selectedFood.portionSizeMethodIndex];
    },
  },
});
