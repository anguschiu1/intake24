import { UserAssociatedFoodPrompt, UserFoodData } from '@common/types/http/foods/user-food-data';
import {
  AssociatedFood,
  Brand,
  Food,
  FoodLocal,
  FoodLocalList,
  FoodNutrient,
  Locale,
  NutrientTableRecord,
  NutrientTableRecordNutrient,
} from '@api/db/models/foods';

import InvalidIdError from '@api/services/foods/invalid-id-error';
import { getParentLocale } from '@api/services/foods/common';

import InheritableAttributesImpl from './inheritable-attributes-service';
import PortionSizeMethodsImpl from './portion-size-methods-service';

// const for KCAL Nutrient
const KCAL_NUTRIENT_TYPE_ID = 1;

export interface FoodDataService {
  getNutrientKCalPer100G(localeId: string, foodCode: string): Promise<number>;
  getFoodData(localeId: string, foodCode: string): Promise<UserFoodData>;
}

export default (): FoodDataService => {
  const inheritableAttributesImpl = InheritableAttributesImpl();
  const portionSizeMethodsImpl = PortionSizeMethodsImpl();

  const getNutrientKCalPer100G = async (localeId: string, foodCode: string): Promise<number> => {
    const foodNutrientData = await FoodLocal.findOne({
      where: { localeId, foodCode },
      attributes: [],
      include: [
        {
          model: NutrientTableRecord,
          attributes: ['id'], // these attributes should be empty, but sequelize crashes if that is the case
          through: { attributes: [] },
          duplicating: true,
          include: [
            {
              model: NutrientTableRecordNutrient,
              where: { nutrientTypeId: KCAL_NUTRIENT_TYPE_ID },
              attributes: ['unitsPer100g'],
            },
          ],
        },
      ],
    });

    if (!foodNutrientData)
      throw new InvalidIdError(
        `Either locale id '${localeId}' or food code '${foodCode}' is ` +
          "invalid, food isn't linked to a nutrient table record, or the energy (kcal) nutrient " +
          'data is missing'
      );

    let kcal = foodNutrientData?.nutrientRecords?.map((el) => {
      return el.nutrients ? el.nutrients[0].unitsPer100g : 0;
    })[0];
    kcal = kcal || 0;
    if (!kcal) {
      const parentLocale = await getParentLocale(localeId);
      if (parentLocale && parentLocale.prototypeLocaleId)
        kcal = await getNutrientKCalPer100G(parentLocale.prototypeLocaleId, foodCode);
    }
    return kcal;
  };

  /**
   *
   * Get all associated Foods that link to this locale and Food Code
   *
   * @param {string} localeId
   * @param {string} foodCode
   * @returns {Promise<AssociatedFoodsResponse[]>}
   */
  const getLocalAssociatedFoodPrompts = async (
    localeId: string,
    foodCode: string
  ): Promise<UserAssociatedFoodPrompt[]> => {
    const associatedFoods = await AssociatedFood.findAll({
      where: { localeId, foodCode },
      attributes: [
        'associatedFoodCode',
        'associatedCategoryCode',
        'text',
        'linkAsMain',
        'genericName',
      ],
    });

    return associatedFoods.map((row) => ({
      foodCode: row.associatedFoodCode ?? undefined,
      categoryCode: row.associatedCategoryCode ?? undefined,
      promptText: row.text,
      linkAsMain: row.linkAsMain,
      genericName: row.genericName,
    }));
  };

  /**
   *
   * Get food brands based on the code of the food and localeId
   *
   * @param {string} localeId
   * @param {string} foodCode
   * @returns {Promise<string[]>}
   */
  const getBrands = async (localeId: string, foodCode: string): Promise<string[]> => {
    const brands = await Brand.findAll({ where: { localeId, foodCode }, attributes: ['name'] });

    return brands ? brands.map((brand) => brand.name) : [];
  };

  const resolveAssociatedFoodPrompts = async (
    localeId: string,
    foodCode: string
  ): Promise<UserAssociatedFoodPrompt[]> => {
    const localPrompts = await getLocalAssociatedFoodPrompts(localeId, foodCode);

    if (localPrompts.length > 0) return localPrompts;

    const locale = await Locale.findOne({
      where: { id: localeId },
      include: [{ model: Locale, as: 'parent' }],
    });

    if (!locale) throw new InvalidIdError(`Unknown locale ID: ${localeId}`);

    if (locale.parent && locale.respondentLanguageId === locale.parent.respondentLanguageId) {
      return resolveAssociatedFoodPrompts(locale.parent.id, foodCode);
    }

    return [];
  };

  const getFoodData = async (localeId: string, foodCode: string): Promise<UserFoodData> => {
    const foodRecord = await Food.findOne({ where: { code: foodCode } });

    if (!foodRecord) throw new InvalidIdError(`Invalid food code: ${foodCode}`);

    const foodListCheck = await FoodLocalList.findOne({
      where: { foodCode, localeId },
      attributes: ['food_code'],
    });

    if (!foodListCheck)
      throw new InvalidIdError(`${foodCode} is not in the food list for locale ${localeId}`);

    const localeCheck = await Locale.findOne({ where: { id: localeId }, attributes: ['id'] });
    if (!localeCheck) throw new InvalidIdError(`Invalid locale ID: ${localeId}`);

    const foodLocal = await FoodLocal.findOne({ where: { foodCode, localeId } });

    if (!foodLocal)
      throw new InvalidIdError(
        `No local food data for food code ${foodCode} in locale ${localeId}`
      );

    const [
      associatedFoodPrompts,
      brandNames,
      kcalPer100g,
      portionSizeMethods,
      inheritableAttributes,
    ] = await Promise.all([
      resolveAssociatedFoodPrompts(localeId, foodCode),
      getBrands(localeId, foodCode),
      getNutrientKCalPer100G(localeId, foodCode),
      portionSizeMethodsImpl.resolvePortionSizeMethods(localeId, foodCode),
      inheritableAttributesImpl.resolveInheritableAttributes(foodCode),
    ]);

    return {
      associatedFoodPrompts,
      brandNames,
      code: foodRecord.code,
      englishName: foodRecord.name,
      groupCode: foodRecord.foodGroupId,
      kcalPer100g,
      localName: foodLocal.name,
      portionSizeMethods,
      readyMealOption: inheritableAttributes.readyMealOption,
      reasonableAmount: inheritableAttributes.reasonableAmount,
      sameAsBeforeOption: inheritableAttributes.sameAsBeforeOption,
    };
  };

  return {
    getNutrientKCalPer100G,
    getFoodData,
  };
};
