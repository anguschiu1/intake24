import { Sequelize } from 'sequelize-typescript';
import {
  Food,
  FoodLocal,
  NutrientMapping,
  NutrientTable,
  NutrientTableRecord,
  NutrientTableRecordNutrient,
  NutrientType,
  NutrientUnit,
} from '@/db/models/foods';

export default async (foodDatabase: Sequelize) => {
  await NutrientUnit.create({
    id: 1,
    description: 'Test unit',
    symbol: 'tu',
  });

  await NutrientType.create({
    id: 1,
    description: 'Energy (kcal)',
    unitId: 1,
  });

  await NutrientTable.create(
    {
      id: 'TEST',
      description: 'Test nutrient table',
      records: [
        {
          id: 1,
          nutrientTableRecordId: 'TN1',
          name: 'Food A',
          localName: 'Food A',
          nutrients: {
            nutrientTypeId: 1,
            unitsPer100g: 100,
          },
        },
      ],
    },
    {
      include: [
        {
          model: NutrientTableRecord,
          include: [NutrientTableRecordNutrient],
        },
      ],
    }
  );

  await Food.create({
    code: 'FOOD1',
    description: 'Test food 1',
    foodGroupId: 1,
    version: '00000000-0000-0000-0000-000000000000',
  });

  await foodDatabase.transaction((t) =>
    FoodLocal.create(
      {
        foodCode: 'FOOD1',
        localeId: 'en_GB',
        name: 'Test food 1',
        simpleName: 'Test food 1',
        version: '00000000-0000-0000-0000-000000000000',
        nutrientMappings: [
          {
            nutrientTableRecordId: 1,
          },
        ],
      },
      {
        transaction: t,
        include: [NutrientMapping],
      }
    )
  );
};
