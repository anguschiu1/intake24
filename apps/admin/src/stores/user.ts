import { defineStore } from 'pinia';

import type { Subject } from '@intake24/common/security';
import type { AdminUserProfileResponse } from '@intake24/common/types/http/admin';
import type { Permission } from '@intake24/ui/types';
import { httpService } from '@intake24/admin/services';
import { tokenService } from '@intake24/ui/services';
import { useLoading } from '@intake24/ui/stores';

import { useResource } from './resource';

export interface UserState {
  payload: {
    userId: string;
    subject: Subject;
  } | null;
  profile: {
    id: string;
    email: string | null;
    name: string | null;
    phone: string | null;
  } | null;
  permissions: string[];
  roles: string[];
}

export const useUser = defineStore('user', {
  state: (): UserState => ({
    payload: null,
    profile: null,
    permissions: [],
    roles: [],
  }),
  getters: {
    loaded: (state) => !!state.profile,
  },
  actions: {
    can(permission: string | string[] | Permission, strict = false) {
      if (typeof permission === 'string') return this.permissions.includes(permission);

      if (Array.isArray(permission)) {
        return strict
          ? permission.every((item) => this.permissions.includes(item))
          : permission.some((item) => this.permissions.includes(item));
      }

      const { name } = useResource();
      const { resource = name, action, ownerId, securables = [] } = permission;

      if (action) {
        if (this.permissions.includes(`${resource}|${action}`)) return true;

        if (securables.length && !!securables.find((securable) => securable.action === action))
          return true;
      }

      if (ownerId && ownerId === this.profile?.id) return true;

      return false;
    },

    async request() {
      const loading = useLoading();
      loading.addItem('user');

      try {
        const {
          data: { profile, permissions, roles },
        } = await httpService.get<AdminUserProfileResponse>('admin/user');

        this.profile = { ...profile };
        this.permissions = [...permissions];
        this.roles = [...roles];

        return Promise.resolve();
      } catch (err) {
        return Promise.reject(err);
      } finally {
        loading.removeItem('user');
      }
    },

    loadPayload(accessToken: string) {
      const { userId, sub } = tokenService.decodeAccessToken(accessToken, 'admin');

      const subject: Subject = JSON.parse(atob(sub));

      this.payload = { userId, subject };
    },
  },
});

export type UserStoreDef = typeof useUser;

export type UserStore = ReturnType<UserStoreDef>;
