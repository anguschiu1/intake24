import type { PortionSizeStates } from '@intake24/common/types';
import type { SurveySubmissionPortionSizeFieldCreationAttributes } from '@intake24/common/types/models';

export const genericMapper = <T extends keyof PortionSizeStates>(
  foodId: string,
  state: PortionSizeStates[T]
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const { method, ...rest } = state;

  return Object.entries(rest).map(([name, value]) => ({ foodId, name, value: value.toString() }));
};

export const asServedMapper = (
  foodId: string,
  state: PortionSizeStates['as-served']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const { leftoversWeight, servingWeight, serving, leftovers } = state;

  return [
    { foodId, name: 'leftovers', value: (!!leftovers).toString() },
    { foodId, name: 'leftoversImage', value: leftovers?.imageUrl ?? '' },
    { foodId, name: 'leftovers-image-set', value: leftovers?.asServedSetId ?? '' },
    { foodId, name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { foodId, name: 'leftoversChoiceIndex', value: leftovers?.index?.toString() ?? '0' },
    { foodId, name: 'servingImage', value: serving?.imageUrl ?? '' },
    { foodId, name: 'serving-image-set', value: serving?.asServedSetId ?? '' },
    { foodId, name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
    { foodId, name: 'servingChoiceIndex', value: serving?.index?.toString() ?? '0' },
  ];
};

export const cerealMapper = (
  foodId: string,
  state: PortionSizeStates['cereal']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const { type, bowl, bowlIndex, imageUrl, leftoversWeight, servingWeight, serving, leftovers } =
    state;

  return [
    { foodId, name: 'type', value: type },
    { foodId, name: 'bowl', value: bowl ?? '' },
    { foodId, name: 'bowlIndex', value: bowlIndex?.toString() ?? '' },
    { foodId, name: 'imageUrl', value: imageUrl ?? '' },
    { foodId, name: 'leftovers', value: (!!leftovers).toString() },
    { foodId, name: 'leftoversImage', value: leftovers?.imageUrl ?? '' },
    { foodId, name: 'leftovers-image-set', value: leftovers?.asServedSetId ?? '' },
    { foodId, name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { foodId, name: 'leftoversChoiceIndex', value: leftovers?.index?.toString() ?? '0' },
    { foodId, name: 'servingImage', value: serving?.imageUrl ?? '' },
    { foodId, name: 'serving-image-set', value: serving?.asServedSetId ?? '' },
    { foodId, name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
    { foodId, name: 'servingChoiceIndex', value: serving?.index?.toString() ?? '0' },
  ];
};

export const guideImageMapper = (
  foodId: string,
  state: PortionSizeStates['guide-image']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const {
    leftoversWeight,
    servingWeight,
    guideImageId,
    imageUrl,
    objectIndex,
    objectWeight,
    quantity: { whole, fraction },
  } = state;

  return [
    { foodId, name: 'guide-image-id', value: guideImageId },
    { foodId, name: 'imageUrl', value: imageUrl ?? '' },
    { foodId, name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { foodId, name: 'objectIndex', value: objectIndex?.toString() ?? '0' },
    { foodId, name: 'objectWeight', value: objectWeight.toString() },
    { foodId, name: 'quantity', value: (whole + fraction).toString() },
    { foodId, name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
  ];
};

export const drinkScaleMapper = (
  foodId: string,
  state: PortionSizeStates['drink-scale']
): SurveySubmissionPortionSizeFieldCreationAttributes[] => {
  const {
    containerIndex,
    drinkwareId,
    fillLevel,
    imageUrl,
    initialFillLevel,
    leftovers,
    leftoversWeight,
    leftoversLevel,
    servingWeight,
    skipFillLevel,
  } = state;

  return [
    { foodId, name: 'containerIndex', value: containerIndex.toString() },
    { foodId, name: 'drinkware-id', value: drinkwareId },
    { foodId, name: 'fillLevel', value: fillLevel.toString() },
    { foodId, name: 'imageUrl', value: imageUrl },
    { foodId, name: 'initial-fill-level', value: initialFillLevel },
    { foodId, name: 'leftovers', value: leftovers.toString() },
    { foodId, name: 'leftoversWeight', value: leftoversWeight?.toString() ?? '0' },
    { foodId, name: 'leftoversLevel', value: leftoversLevel.toString() },
    { foodId, name: 'servingWeight', value: servingWeight?.toString() ?? '0' },
    { foodId, name: 'skip-fill-level', value: skipFillLevel },
  ];
};

export const portionSizeMappers: Record<
  keyof PortionSizeStates,
  (...arg: any[]) => SurveySubmissionPortionSizeFieldCreationAttributes[]
> = {
  'as-served': asServedMapper,
  cereal: cerealMapper,
  'drink-scale': drinkScaleMapper,
  'guide-image': guideImageMapper,
  'milk-in-a-hot-drink': genericMapper,
  'milk-on-cereal': genericMapper,
  pizza: genericMapper,
  'standard-portion': genericMapper,
  weight: genericMapper,
};

export type PortionSizeMappers = typeof portionSizeMappers;
