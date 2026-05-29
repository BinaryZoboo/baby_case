import { useContext } from "react";
import { authContext } from "./auth-context";

export function useAuth() {
  const context = useContext(authContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur du AuthProvider");
  }
  return context;
}
