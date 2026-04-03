"server-only";

import { syncCurrentUser } from "@/src/lib/auth";

export const upserUser = async (
  _firstName: string | null,
  _lastName: string | null,
  _email: string,
  _id: string
) => {
  return syncCurrentUser();
};
