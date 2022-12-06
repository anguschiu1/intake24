import { Column, CreatedAt, DataType, Table, UpdatedAt } from 'sequelize-typescript';

import type { Prompt } from '@intake24/common/prompts';
import type {
  SurveySchemeQuestionAttributes,
  SurveySchemeQuestionCreationAttributes,
} from '@intake24/common/types/models';

import BaseModel from '../model';

@Table({
  modelName: 'SurveySchemeQuestion',
  tableName: 'survey_scheme_questions',
  freezeTableName: true,
  underscored: true,
})
export default class SurveySchemeQuestion
  extends BaseModel<SurveySchemeQuestionAttributes, SurveySchemeQuestionCreationAttributes>
  implements SurveySchemeQuestionAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public questionId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public name!: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get question(): Prompt {
    const val = this.getDataValue('question') as unknown;
    return val ? JSON.parse(val as string) : {};
  }

  set question(value: Prompt) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('question', JSON.stringify(value ?? {}));
  }

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;
}
