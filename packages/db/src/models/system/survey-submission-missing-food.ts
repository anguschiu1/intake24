import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';

import BaseModel from '../model';
import { SurveySubmissionMeal } from '.';

@Scopes(() => ({
  meal: { include: [{ model: SurveySubmissionMeal }] },
}))
@Table({
  modelName: 'SurveySubmissionMissingFood',
  tableName: 'survey_submission_missing_foods',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SurveySubmissionMissingFood extends BaseModel<
  InferAttributes<SurveySubmissionMissingFood>,
  InferCreationAttributes<SurveySubmissionMissingFood>
> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
  })
  declare id: string;

  @Column({
    allowNull: true,
    type: DataType.UUID,
  })
  declare parentId: CreationOptional<string | null>;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  declare mealId: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  declare name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  declare brand: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  declare description: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  declare portionSize: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  declare leftovers: string;

  @BelongsTo(() => SurveySubmissionMeal, 'mealId')
  declare meal?: NonAttribute<SurveySubmissionMeal>;
}

export type SurveySubmissionMissingFoodAttributes = Attributes<SurveySubmissionMissingFood>;
export type SurveySubmissionMissingFoodCreationAttributes =
  CreationAttributes<SurveySubmissionMissingFood>;
