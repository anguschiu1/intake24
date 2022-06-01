import type { UserEntry, UserSecurableListEntry } from '@intake24/common/types/http/admin';
import type { User } from '@intake24/db';

export const userEntryResponse = (user: User): UserEntry => {
  const { aliases = [], customFields = [], permissions = [], roles = [] } = user;

  return {
    ...user.get(),
    aliases,
    customFields,
    permissions,
    roles,
  };
};

export const userSecurablesResponse = (user: User): UserSecurableListEntry => {
  const { id, name, email, securables = [] } = user;

  return { id, name, email, securables };
};
