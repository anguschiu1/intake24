import { CategoryPortionSizeMethodParameter, PortionSizeMethodParameter } from '@/db/models/foods';

export type UserPortionSizeMethodParameters = { [name: string]: string };

export function toUserPortionSizeMethodParameters(
  parameters: PortionSizeMethodParameter[]
): UserPortionSizeMethodParameters {
  const result: UserPortionSizeMethodParameters = {};

  for (let i = 0; i < parameters.length; ++i) {
    result[parameters[i].name] = parameters[i].value;
  }

  return result;
}

export function toUserCategoryPortionSizeMethodParameters(
  parameters: CategoryPortionSizeMethodParameter[]
): UserPortionSizeMethodParameters {
  const result: UserPortionSizeMethodParameters = {};

  for (let i = 0; i < parameters.length; ++i) {
    result[parameters[i].name] = parameters[i].value;
  }

  return result;
}
