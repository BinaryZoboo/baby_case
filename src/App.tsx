import { useEffect, useState } from "react";
import SearcherView from "./components/SearcherView";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<
    "login" | "signup" | "dashboard"
  >("login");

  // Écoute les changements de hash pour la navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === "signup") {
        setCurrentPage("signup");
      } else if (hash === "login") {
        setCurrentPage("login");
      } else if (hash === "dashboard") {
        setCurrentPage("dashboard");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Appelle au chargement initial

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Affiche un écran de chargement pendant que Supabase charge la session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-pink-500 border-t-transparent mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Chargement...</h2>
        </div>
      </div>
    );
  }

  // ✅ Utilisateur authentifié → Affiche le tableau de bord
  if (user) {
    return <SearcherView />;
  }

  // ❌ Utilisateur non authentifié → Affiche les pages d'authentification
  if (currentPage === "signup") {
    return (
      <SignupPage
        onSignupSuccess={() => {
          window.location.hash = "#login";
          setCurrentPage("login");
        }}
      />
    );
  }

  return (
    <LoginPage
      onLoginSuccess={() => {
        window.location.hash = "#dashboard";
        setCurrentPage("dashboard");
      }}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
