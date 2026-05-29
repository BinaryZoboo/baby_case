import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface SignupPageProps {
  onSignupSuccess: () => void;
}

export default function SignupPage({ onSignupSuccess }: SignupPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"client" | "host">("host");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Valide les données du formulaire
  const validateForm = (): string | null => {
    if (!email.trim() || !password || !confirmPassword || !fullName.trim()) {
      return "Veuillez remplir tous les champs";
    }

    if (!email.includes("@")) {
      return "Veuillez entrer une adresse email valide";
    }

    if (password.length < 6) {
      return "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (password !== confirmPassword) {
      return "Les mots de passe ne correspondent pas";
    }

    if (fullName.length < 2) {
      return "Veuillez entrer un nom valide";
    }

    return null;
  };

  // Gère la soumission du formulaire d'inscription
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation côté client
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Appel à Supabase pour créer le compte
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: role,
          },
        },
      });

      if (authError) {
        // Gestion des erreurs Supabase
        if (authError.message.includes("already registered")) {
          throw new Error(
            "Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email",
          );
        }
        if (authError.message.includes("password")) {
          throw new Error(
            "Le mot de passe ne respecte pas les critères de sécurité",
          );
        }
        throw new Error(authError.message || "Erreur lors de l'inscription");
      }

      if (data.user) {
        console.log("✅ Inscription réussie:", data.user.email);

        // ℹ️ Note importante :
        // Supabase envoie un email de confirmation. L'utilisateur doit confirmer
        // son email avant de pouvoir se connecter (selon la configuration Supabase).
        // Tu peux aussi ajouter du code ici pour créer automatiquement un profil
        // utilisateur dans la table `users` de ta BDD.

        setSuccess(true);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFullName("");

        // Redirection après succès
        setTimeout(() => {
          onSignupSuccess();
        }, 2000);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      console.error("❌ Erreur d'inscription:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-blue-50 p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Inscription réussie !
            </h2>
            <p className="text-gray-600 mb-6">
              Un email de confirmation a été envoyé à <strong>{email}</strong>.
              Veuillez confirmer votre email pour continuer.
            </p>
            <button
              onClick={() => (window.location.hash = "#login")}
              className="w-full py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:shadow-lg transition-all"
            >
              Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-blue-50 p-4">
      {/* Conteneur principal */}
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            👶{" "}
            <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
              babycase
            </span>
          </h1>
          <p className="text-gray-600">Trouvez le prénom parfait en famille</p>
        </div>

        {/* Carte d'inscription */}
        <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Créer un compte
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Champ Nom complet */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Nom complet
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50"
              />
            </div>

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
                placeholder="johndoe@example.com"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50"
              />
            </div>

            {/* Sélecteur Rôle */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Rôle
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as "client" | "host")}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50"
              >
                <option value="host">Papa / Maman a en devenir</option>
                <option value="client">Famille / Amis</option>
              </select>
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
              <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
            </div>

            {/* Champ Confirmer mot de passe */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50"
              />
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
                <span className="font-semibold">⚠️ Erreur:</span> {error}
              </div>
            )}

            {/* Bouton Inscription */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Création du compte...
                </span>
              ) : (
                "S'inscrire"
              )}
            </button>
          </form>

          {/* Séparateur */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500">ou</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Lien vers connexion */}
          <p className="text-center text-gray-600">
            Déjà inscrit ?{" "}
            <button
              type="button"
              onClick={() => (window.location.hash = "#login")}
              className="font-semibold text-pink-500 hover:text-fuchsia-500 transition-colors"
            >
              Se connecter
            </button>
          </p>
        </div>

        {/* Note de sécurité */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Tes données sont sécurisées par Supabase</p>
        </div>
      </div>
    </div>
  );
}
