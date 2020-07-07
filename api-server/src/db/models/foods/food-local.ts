import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import Food from './food';
import Locale from './locale';

@Scopes(() => ({
  food: { include: [{ model: Food }] },
  locale: { include: [{ model: Locale }] },
}))
@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'foods_local'
})
export default class FoodLocal extends BaseModel<FoodLocal> {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public foodCode!: string;

  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public localeId!: string;

  @Column
  public localDescription!: string;

  @Column
  public simpleLocalDescription!: string;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public version!: string;

  @BelongsTo(() => Food, 'foodCode')
  public food?: Food;

  @BelongsTo(() => Locale, 'localeId')
  public locale?: Locale;
}
