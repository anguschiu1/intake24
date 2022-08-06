import { BelongsTo, Column, CreatedAt, DataType, Table, UpdatedAt } from 'sequelize-typescript';

import type { Application } from '@intake24/common/types';
import type {
  LanguageTranslationAttributes,
  LanguageTranslationCreationAttributes,
} from '@intake24/common/types/models';
import type { LocaleMessageObject } from '@intake24/i18n';

import BaseModel from '../model';
import { Language } from '.';

@Table({
  modelName: 'LanguageTranslations',
  tableName: 'language_translations',
  freezeTableName: true,
  underscored: true,
})
export default class LanguageTranslation
  extends BaseModel<LanguageTranslationAttributes, LanguageTranslationCreationAttributes>
  implements LanguageTranslationAttributes
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
    unique: 'language_translations_unique',
  })
  public languageId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
    unique: 'language_translations_unique',
  })
  public application!: Application;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
    unique: 'language_translations_unique',
  })
  public section!: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  get messages(): LocaleMessageObject {
    const val = this.getDataValue('messages') as unknown;
    return JSON.parse(val as string);
  }

  set messages(value: LocaleMessageObject) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('messages', JSON.stringify(value));
  }

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsTo(() => Language, 'languageId')
  public language?: Language[];
}
