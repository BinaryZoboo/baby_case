import type { Session, User } from "@supabase/supabase-js";
import { createContext } from "react";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

export const authContext = createContext<AuthContextType | undefined>(
  undefined,
);
