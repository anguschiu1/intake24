import type { TopFoods } from '@intake24/common/feedback';
import type { NutrientType } from '@intake24/common/types/http';
import { getLocaleContent, getNutrientUnit } from '@intake24/ui/util';

import type { NutrientChartData } from './charts';
import { AggregateFoodStats } from './classes';

export interface TopFoodData extends TopFoods {
  chartData: NutrientChartData[];
}

export const filterAndSortFoodByNutrientTypeId = (
  nutrientTypeId: string[],
  foods: AggregateFoodStats[]
): AggregateFoodStats[] =>
  foods
    .map((food) => food.clone())
    .filter((f) => f.getGroupAverageIntake(nutrientTypeId) > 0)
    .sort(
      (a, b) => b.getGroupAverageIntake(nutrientTypeId) - a.getGroupAverageIntake(nutrientTypeId)
    );

export const summarizeOtherFood = (
  nutrientTypeId: string[],
  foods: AggregateFoodStats[]
): AggregateFoodStats[] => {
  if (!foods.length) return [];

  const nutrients = new Map<string, number>();
  nutrientTypeId.forEach((id) => {
    nutrients.set(
      id,
      foods.map((f) => f.getAverageIntake(id)).reduce((a, b) => a + b)
    );
  });

  return [new AggregateFoodStats('Other food', nutrients)];
};

export const buildTopFoods = (
  topFoods: TopFoods,
  foods: AggregateFoodStats[],
  nutrientTypes: NutrientType[] = []
): TopFoodData => {
  const { max } = topFoods;
  if (!max || !topFoods.nutrientTypes.length) return { ...topFoods, chartData: [] };

  const chartData = topFoods.nutrientTypes.map((nutrient) => {
    const { id } = nutrient;

    const name = getLocaleContent(nutrient.name);
    const unit = getNutrientUnit(id, nutrientTypes);

    const foodHighInNutrient = filterAndSortFoodByNutrientTypeId(id, foods);
    const other = foodHighInNutrient.slice(max);

    const list = foodHighInNutrient.slice(0, max).concat(summarizeOtherFood(id, other));

    const data = list.map((food) => ({
      name: food.name,
      value: food.getGroupAverageIntake(id),
    }));

    return { id, name, unit, data };
  });

  return { ...topFoods, chartData };
};
