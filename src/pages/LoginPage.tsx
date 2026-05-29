import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Gère la soumission du formulaire de connexion
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validation basique côté client
      if (!email.trim() || !password.trim()) {
        throw new Error("Veuillez remplir tous les champs");
      }

      if (!email.includes("@")) {
        throw new Error("Veuillez entrer une adresse email valide");
      }

      // ✅ Appel à Supabase pour la connexion
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: email.trim(),
          password,
        },
      );

      if (authError) {
        // Gestion des erreurs Supabase
        if (authError.message.includes("Invalid login credentials")) {
          throw new Error("Email ou mot de passe incorrect");
        }
        if (authError.message.includes("Email not confirmed")) {
          throw new Error(
            "Veuillez confirmer votre email avant de vous connecter",
          );
        }
        throw new Error(authError.message || "Erreur lors de la connexion");
      }

      // Succès ! L'utilisateur est connecté
      if (data.user) {
        console.log("✅ Connexion réussie:", data.user.email);
        onLoginSuccess();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      console.error("❌ Erreur de connexion:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-blue-50 p-4">
      {/* Conteneur principal */}
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            👶{" "}
            <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
              Baby Case
            </span>
          </h1>
          <p className="text-gray-600">
            Transformez l'annonce de son prénom en une{" "}
            <span className="font-bold">enquête inoubliable.</span>
          </p>
        </div>

        {/* Carte de connexion */}
        <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Connexion</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Champ Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="parent@example.com"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50"
              />
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
                <span className="font-semibold">⚠️ Erreur:</span> {error}
              </div>
            )}

            {/* Bouton Connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Connexion en cours...
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Séparateur */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500">ou</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Lien vers inscription */}
          <p className="text-center text-gray-600">
            Pas encore de compte ?{" "}
            <button
              type="button"
              onClick={() => (window.location.hash = "#signup")}
              className="font-semibold text-pink-500 hover:text-fuchsia-500 transition-colors"
            >
              S'inscrire
            </button>
          </p>
        </div>

        {/* Note d'aide */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            💡 <strong>Conseil :</strong> Utilise une adresse email valide pour
            tester
          </p>
        </div>
      </div>
    </div>
  );
}
