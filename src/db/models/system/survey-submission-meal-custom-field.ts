import { BelongsTo, Column, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import SurveySubmissionMeal from './survey-submission-meal';

@Scopes(() => ({
  meal: { include: [{ model: SurveySubmissionMeal }] },
}))
@Table({
  timestamps: false,
  underscored: true,
})
export default class SurveySubmissionMealCustomField extends BaseModel<
  SurveySubmissionMealCustomField
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public mealId!: number;

  @Column({
    allowNull: false,
  })
  public name!: string;

  @Column({
    allowNull: false,
  })
  public value!: string;

  @BelongsTo(() => SurveySubmissionMeal, 'mealId')
  public meal?: SurveySubmissionMeal;
}
