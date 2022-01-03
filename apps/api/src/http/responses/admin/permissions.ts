/* eslint-disable import/prefer-default-export */
import { PermissionListEntry } from '@common/types/http/admin';
import { Permission } from '@api/db';

export const permissionListResponse = (permission: Permission): PermissionListEntry => {
  const { id, name, displayName } = permission;
  return { id, name, displayName };
};
