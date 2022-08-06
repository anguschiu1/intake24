import {
  AfterBulkCreate,
  AfterCreate,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import type {
  PermissionAttributes,
  PermissionCreationAttributes,
} from '@intake24/common/types/models';
import config from '@intake24/api/config/acl';

import BaseModel from '../model';
import { PermissionRole, PermissionUser, Role, User } from '.';

// eslint-disable-next-line no-use-before-define
export const addPermissionsToAdmin = async (permissions: Permission[]): Promise<void> => {
  const admin = await Role.findOne({ where: { name: config.roles.superuser } });
  if (admin) await admin.$add('permissions', permissions);
};

@Scopes(() => ({
  list: { attributes: ['id', 'name', 'displayName'], order: [['name', 'ASC']] },
  roles: { include: [{ model: Role, through: { attributes: [] } }] },
  rolesUsers: { include: [{ model: Role, include: [{ model: User }] }] },
  users: { include: [{ model: User, through: { attributes: [] } }] },
}))
@Table({
  modelName: 'Permission',
  tableName: 'permissions',
  freezeTableName: true,
  underscored: true,
})
export default class Permission
  extends BaseModel<PermissionAttributes, PermissionCreationAttributes>
  implements PermissionAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(128),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public displayName!: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  public description!: string | null;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsToMany(() => Role, () => PermissionRole)
  public roles?: Role[];

  @BelongsToMany(() => User, () => PermissionUser)
  public users?: User[];

  // Always attach new permission(s) to main admin/superuser role
  @AfterCreate
  static async handleAdminPermission(permission: Permission): Promise<void> {
    await addPermissionsToAdmin([permission]);
  }

  @AfterBulkCreate
  static async handleAdminPermissions(permissions: Permission[]): Promise<void> {
    await addPermissionsToAdmin(permissions);
  }
}
