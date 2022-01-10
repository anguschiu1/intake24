import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import {
  SynonymSetsAttributes,
  SynonymSetsAttributesCreationAttributes,
} from '@intake24/common/types/models/foods';
import BaseModel from '../model';
import { FoodsLocale } from '.';

@Table({
  modelName: 'SynonymSet',
  tableName: 'synonym_sets',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SynonymSet
  extends BaseModel<SynonymSetsAttributes, SynonymSetsAttributesCreationAttributes>
  implements SynonymSetsAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  public localeId!: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  public synonyms!: string;

  @BelongsTo(() => FoodsLocale, 'localeId')
  public locale?: FoodsLocale;
}
