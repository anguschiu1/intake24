import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { paginationMeta, paginationRequest } from '@intake24/common/types/http';
import {
  roleAttributes,
  roleRequest,
  rolRefs,
} from '@intake24/common/types/http/admin';

export const role = initContract().router({
  browse: {
    method: 'GET',
    path: '/admin/roles',
    query: paginationRequest,
    responses: {
      200: z.object({
        data: roleAttributes.array(),
        meta: paginationMeta,
      }),
    },
    summary: 'Browse roles',
    description: 'Browse roles (paginated list)',
  },
  store: {
    method: 'POST',
    path: '/admin/roles',
    body: roleRequest,
    responses: {
      201: roleAttributes,
    },
    summary: 'Create role',
    description: 'Create new role',
  },
  refs: {
    method: 'GET',
    path: '/admin/roles/refs',
    responses: {
      200: rolRefs,
    },
    summary: 'Role references',
    description: 'Role reference data',
  },
  read: {
    method: 'GET',
    path: '/admin/roles/:roleId',
    responses: {
      200: roleAttributes,
    },
    summary: 'Get role',
    description: 'Get role by id',
  },
  edit: {
    method: 'GET',
    path: '/admin/roles/:roleId/edit',
    responses: {
      200: roleAttributes,
    },
    summary: 'Get role for edit',
    description: 'Get role by id for edit',
  },
  update: {
    method: 'PUT',
    path: '/admin/roles/:roleId',
    body: roleRequest.omit({ name: true }),
    responses: {
      200: roleAttributes,
    },
    summary: 'Update role',
    description: 'Update role by id',
  },
  destroy: {
    method: 'DELETE',
    path: '/admin/roles/:roleId',
    body: null,
    responses: {
      204: z.undefined(),
    },
    summary: 'Delete role',
    description: 'Delete role by id',
  },
  permissions: {
    method: 'GET',
    path: '/admin/roles/:roleId/permissions',
    query: paginationRequest,
    responses: {
      200: z.object({
        data: roleAttributes.array(),
        meta: paginationMeta,
      }),
    },
    summary: 'Browse assigned permissions',
    description: 'Browse assigned permissions (paginated list)',
  },
  users: {
    method: 'GET',
    path: '/admin/roles/:roleId/users',
    query: paginationRequest,
    responses: {
      200: z.object({
        data: roleAttributes.array(),
        meta: paginationMeta,
      }),
    },
    summary: 'Browse assigned users',
    description: 'Browse assigned users (paginated list)',
  },
});
