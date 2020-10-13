import { BelongsTo, Column, HasMany, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import { GuideImage, ProcessedImage } from '.';

@Scopes(() => ({
  guideImages: { include: [{ model: GuideImage }] },
  baseImage: { include: [{ model: ProcessedImage }] },
}))
@Table({
  modelName: 'ImageMap',
  tableName: 'image_maps',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class ImageMap extends BaseModel<ImageMap> {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: string;

  @Column({
    allowNull: false,
  })
  public description!: string;

  @Column({
    allowNull: false,
  })
  public baseImageId!: number;

  @HasMany(() => GuideImage, 'imageMapId')
  public guideImages?: GuideImage[];

  @BelongsTo(() => ProcessedImage, 'baseImageId')
  public baseImage?: ProcessedImage;
}
