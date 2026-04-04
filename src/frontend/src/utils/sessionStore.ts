// Module-level in-memory session store.
// This is the source of truth for auth guards (which run before React renders).
// AppContext syncs to this store on every session change.

import type { UserSession } from "@/types";

let _session: UserSession | null = null;

export const sessionStore = {
  get(): UserSession | null {
    return _session;
  },
  set(s: UserSession | null): void {
    _session = s;
  },
};
