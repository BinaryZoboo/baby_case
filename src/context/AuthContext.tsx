import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";
import type { AuthContextType } from "./auth-context";
import { authContext } from "./auth-context";

// Fournisseur d'authentification
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupère la session existante au chargement
    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        setSession(data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error("Erreur lors de la récupération de la session:", error);
      } finally {
        setIsLoading(false);
      }
    })();

    // Écoute les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      console.log(
        "📢 État d'authentification changé:",
        session ? "Connecté" : "Déconnecté",
      );
    });

    // Nettoie l'abonnement au démontage
    return () => subscription?.unsubscribe();
  }, []);

  // Fonction pour se déconnecter
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("✅ Déconnexion réussie");
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion:", error);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    logout,
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}
