import { BelongsTo, Column, DataType, ForeignKey, Scopes, Table } from 'sequelize-typescript';
import type { NutrientTypeAttributes } from '@intake24/common/types/models';
import BaseModel from '../model';
import { SystemNutrientUnit } from '.';

@Scopes(() => ({
  unit: { include: [{ model: SystemNutrientUnit }] },
  list: { order: [['id', 'ASC']] },
}))
@Table({
  modelName: 'NutrientType',
  tableName: 'nutrient_types',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientType
  extends BaseModel<NutrientTypeAttributes>
  implements NutrientTypeAttributes
{
  @Column({
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public description!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  @ForeignKey(() => SystemNutrientUnit)
  public unitId!: string;

  @BelongsTo(() => SystemNutrientUnit, 'unitId')
  public unit?: SystemNutrientUnit;
}
