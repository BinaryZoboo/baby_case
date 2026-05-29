import { useMemo, useState } from "react";
import { useAuth } from "../context/useAuth";

// ============================================================================
// TYPES & MOCK DATA
// ============================================================================

interface FirstName {
  id: string;
  name: string;
  isEliminated: boolean;
}

interface Hint {
  id: number;
  title: string;
  content: string;
  isUnlocked: boolean;
  unlocksIn?: string;
}

interface FamilyMember {
  id: string;
  name: string;
  eliminationCount: number;
  avatarColor: string;
}

// Mock Data - Environ 48 prénoms réalistes
const INITIAL_NAMES: FirstName[] = [
  { id: "1", name: "Mia", isEliminated: false },
  { id: "2", name: "Sarah", isEliminated: false },
  { id: "3", name: "Léna", isEliminated: false },
  { id: "4", name: "Zoé", isEliminated: false },
  { id: "5", name: "Romy", isEliminated: false },
  { id: "6", name: "Inès", isEliminated: false },
  { id: "7", name: "Léa", isEliminated: false },
  { id: "8", name: "Manon", isEliminated: false },
  { id: "9", name: "Alice", isEliminated: false },
  { id: "10", name: "Juliette", isEliminated: false },
  { id: "11", name: "Emma", isEliminated: false },
  { id: "12", name: "Hugo", isEliminated: false },
  { id: "13", name: "Noah", isEliminated: false },
  { id: "14", name: "Arthur", isEliminated: false },
  { id: "15", name: "Mathis", isEliminated: false },
  { id: "16", name: "Gabriel", isEliminated: false },
  { id: "17", name: "Théo", isEliminated: false },
  { id: "18", name: "Rémi", isEliminated: false },
  { id: "19", name: "Liam", isEliminated: false },
  { id: "20", name: "Élise", isEliminated: false },
  { id: "21", name: "Camille", isEliminated: false },
  { id: "22", name: "Sophie", isEliminated: false },
  { id: "23", name: "Clara", isEliminated: false },
  { id: "24", name: "Nora", isEliminated: false },
  { id: "25", name: "Lola", isEliminated: false },
  { id: "26", name: "Amélie", isEliminated: false },
  { id: "27", name: "Chloé", isEliminated: false },
  { id: "28", name: "Jeanne", isEliminated: false },
  { id: "29", name: "Margot", isEliminated: false },
  { id: "30", name: "Justine", isEliminated: false },
  { id: "31", name: "Aurore", isEliminated: false },
  { id: "32", name: "Luna", isEliminated: false },
  { id: "33", name: "Iris", isEliminated: false },
  { id: "34", name: "Nina", isEliminated: false },
  { id: "35", name: "Eva", isEliminated: false },
  { id: "36", name: "Olivia", isEliminated: false },
  { id: "37", name: "Anémone", isEliminated: false },
  { id: "38", name: "Mathieu", isEliminated: false },
  { id: "39", name: "Louis", isEliminated: false },
  { id: "40", name: "Lucas", isEliminated: false },
  { id: "41", name: "Victor", isEliminated: false },
  { id: "42", name: "Jules", isEliminated: false },
  { id: "43", name: "Raphaël", isEliminated: false },
  { id: "44", name: "Antoine", isEliminated: false },
  { id: "45", name: "Jérôme", isEliminated: false },
  { id: "46", name: "Simon", isEliminated: false },
  { id: "47", name: "Adèle", isEliminated: false },
  { id: "48", name: "Léonie", isEliminated: false },
];

const HINTS: Hint[] = [
  {
    id: 1,
    title: "Indice 1",
    content: "Le prénom contient entre 4 et 6 lettres.",
    isUnlocked: true,
  },
  {
    id: 2,
    title: "Indice 2",
    content: "Il se termine par une voyelle.",
    isUnlocked: true,
  },
  {
    id: 3,
    title: "Indice 3",
    content: "Un mystère qui se dévoilera bientôt...",
    isUnlocked: false,
    unlocksIn: "3 jours",
  },
];

const FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: "1",
    name: "Tata Sophie",
    eliminationCount: 142,
    avatarColor: "from-pink-400 to-rose-400",
  },
  {
    id: "2",
    name: "Parrain Jean",
    eliminationCount: 110,
    avatarColor: "from-blue-400 to-indigo-400",
  },
  {
    id: "3",
    name: "Tonton Michel",
    eliminationCount: 87,
    avatarColor: "from-green-400 to-emerald-400",
  },
];

// ============================================================================
// SVG ICONS
// ============================================================================

const LockIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
      clipRule="evenodd"
    />
  </svg>
);

const SearchIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const FilterIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SearcherView() {
  const { logout } = useAuth();
  const [names, setNames] = useState<FirstName[]>(INITIAL_NAMES);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyRemaining, setShowOnlyRemaining] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Statistiques calculées
  const stats = useMemo(() => {
    const eliminated = names.filter((n) => n.isEliminated).length;
    const remaining = names.length - eliminated;
    const globalPercentage = Math.round((eliminated / names.length) * 100);
    return { eliminated, remaining, globalPercentage };
  }, [names]);

  // Filtre les noms en fonction de la recherche et du filtre
  const filteredNames = useMemo(() => {
    return names.filter((name) => {
      const matchesSearch = name.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter = !showOnlyRemaining || !name.isEliminated;
      return matchesSearch && matchesFilter;
    });
  }, [names, searchQuery, showOnlyRemaining]);

  // Bascule l'état d'élimination d'un prénom
  const toggleElimination = (id: string) => {
    setNames((prev) =>
      prev.map((name) =>
        name.id === id ? { ...name, isEliminated: !name.isEliminated } : name,
      ),
    );
  };

  // Réinitialise la grille
  const resetGrid = () => {
    setNames(INITIAL_NAMES);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {/* Fond avec dégradé radial discret */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/30" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-gradient-radial from-pink-200/20 via-transparent to-transparent blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-radial from-blue-200/15 via-transparent to-transparent blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* COMPOSANT A : HEADER */}
        <header className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">👶</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                babycase
              </h1>
              <p className="text-sm text-slate-500">
                Enquête collaborative en direct
              </p>
            </div>
          </div>

          {/* Avatar utilisateur + Bouton déconnexion */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
                TM
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-900">
                  Tonton Michel
                </p>
                <p className="text-xs text-slate-500">Connecté</p>
              </div>
            </div>

            {/* Bouton Déconnexion */}
            <button
              onClick={async () => {
                setIsLoggingOut(true);
                await logout();
                window.location.hash = "#login";
              }}
              disabled={isLoggingOut}
              className="px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Se déconnecter"
            >
              {isLoggingOut ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></span>
                </span>
              ) : (
                "🚪"
              )}
            </button>
          </div>
        </header>

        {/* COMPOSANT B : INDICES - BENTO GRID */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Les Indices de la Semaine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HINTS.map((hint) => (
              <div
                key={hint.id}
                className={`
                  group relative overflow-hidden rounded-3xl transition-all duration-500
                  ${
                    hint.isUnlocked
                      ? "bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:border-white/60"
                      : "bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900/50 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.1)]"
                  }
                `}
              >
                {/* Élément flottant de fond (pour effet de matière) */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

                <div className="relative p-6 space-y-4">
                  {/* Titre et badge */}
                  <div className="flex items-start justify-between">
                    <h3
                      className={`text-lg font-semibold tracking-tight ${hint.isUnlocked ? "text-slate-900" : "text-white"}`}
                    >
                      {hint.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        hint.isUnlocked
                          ? "bg-emerald-100/80 text-emerald-700"
                          : "bg-white/10 text-slate-300"
                      }`}
                    >
                      {hint.isUnlocked ? "✓ Révélé" : "🔒 Verrouillé"}
                    </span>
                  </div>

                  {/* Contenu de l'indice */}
                  {hint.isUnlocked ? (
                    <p className="text-base text-slate-700 leading-relaxed">
                      {hint.content}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-center py-6">
                        <LockIcon className="w-12 h-12 text-slate-500/40" />
                      </div>
                      <p className="text-sm text-slate-400 text-center">
                        Prochain indice dans{" "}
                        <span className="font-semibold text-slate-300">
                          {hint.unlocksIn}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COMPOSANT C : STATISTIQUES COLLABORATIVES */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Barre de progression globale */}
          <div className="lg:col-span-2 rounded-3xl bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Progression Globale de l'Enquête
              </h3>
              <span className="text-3xl font-bold text-rose-500">
                {stats.globalPercentage}%
              </span>
            </div>

            {/* Barre de progression */}
            <div className="w-full h-3 bg-slate-200/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all duration-500 ease-out"
                style={{ width: `${stats.globalPercentage}%` }}
              />
            </div>

            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">
                {stats.eliminated}
              </span>{" "}
              prénoms éliminés sur{" "}
              <span className="font-semibold text-slate-900">
                {names.length}
              </span>
            </p>
          </div>

          {/* Statistiques clés */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-4 text-center space-y-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Restants
              </p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {stats.remaining}
              </p>
            </div>
            <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-4 text-center space-y-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Chercheurs
              </p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                {FAMILY_MEMBERS.length}
              </p>
            </div>
          </div>
        </section>

        {/* CLASSEMENT DES ENQUÊTEURS */}
        <div className="rounded-3xl bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            🏆 Top Enquêteurs
          </h3>
          <div className="space-y-3">
            {FAMILY_MEMBERS.map((member, index) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
              >
                {/* Rang */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center font-bold text-slate-700 text-sm">
                  {index + 1}
                </div>

                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${member.avatarColor} flex items-center justify-center text-white font-bold text-xs`}
                >
                  {member.name.charAt(0)}
                  {member.name.split(" ").pop()?.charAt(0)}
                </div>

                {/* Infos */}
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{member.name}</p>
                  <p className="text-xs text-slate-500">
                    {member.eliminationCount} éliminations
                  </p>
                </div>

                {/* Badge */}
                <div className="text-sm font-bold text-slate-700">
                  {member.eliminationCount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMPOSANT D : BARRE D'OUTILS FILTRE */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          {/* Barre de recherche */}
          <div className="flex-1 relative group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher un prénom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 text-slate-900 placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-300/50 shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
            />
          </div>

          {/* Bouton filtre */}
          <button
            onClick={() => setShowOnlyRemaining(!showOnlyRemaining)}
            className={`px-4 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap shadow-[0_8px_30px_rgb(0,0,0,0.03)] ${
              showOnlyRemaining
                ? "bg-rose-500/90 text-white border border-rose-400 hover:bg-rose-600"
                : "bg-white/70 backdrop-blur-md border border-white/40 text-slate-700 hover:bg-white/90"
            }`}
          >
            <FilterIcon className="w-5 h-5" />
            <span className="hidden sm:inline">
              {showOnlyRemaining ? "Restants" : "Tous"}
            </span>
          </button>

          {/* Bouton réinitialiser */}
          <button
            onClick={resetGrid}
            className="px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 text-slate-700 font-medium hover:bg-white/90 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
          >
            Réinitialiser
          </button>
        </div>

        {/* COMPOSANT E : GRILLE DE PRÉNOMS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              🔍 Grille de Recherche
            </h2>
            <p className="text-sm text-slate-600">
              <span className="font-semibold">{filteredNames.length}</span>{" "}
              prénom(s)
            </p>
          </div>

          <div className="rounded-3xl bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-8">
            {filteredNames.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-slate-600">
                  Aucun prénom ne correspond à votre recherche.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowOnlyRemaining(false);
                  }}
                  className="text-rose-500 hover:text-rose-600 font-medium transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {filteredNames.map((name) => (
                  <button
                    key={name.id}
                    onClick={() => toggleElimination(name.id)}
                    className={`
                      group relative px-3 py-2 rounded-2xl font-medium transition-all duration-300
                      transform hover:-translate-y-0.5 active:scale-95
                      ${
                        name.isEliminated
                          ? "bg-slate-100/50 text-slate-400 opacity-25 line-through scale-95 hover:scale-95 cursor-not-allowed"
                          : `
                            bg-white/90 text-slate-900 border-2 border-transparent
                            shadow-[0_4px_15px_rgb(0,0,0,0.04)]
                            hover:shadow-[0_8px_25px_rgb(0,0,0,0.08)]
                          `
                      }
                      ${
                        !name.isEliminated &&
                        `
                        ${parseInt(name.id) % 4 === 0 ? "border-pink-300/40" : ""}
                        ${parseInt(name.id) % 4 === 1 ? "border-blue-300/40" : ""}
                        ${parseInt(name.id) % 4 === 2 ? "border-emerald-300/40" : ""}
                        ${parseInt(name.id) % 4 === 3 ? "border-amber-300/40" : ""}
                        `
                      }
                    `}
                    title={
                      name.isEliminated
                        ? "Cliquez pour réactiver"
                        : "Cliquez pour éliminer"
                    }
                  >
                    {name.name}

                    {/* Indicateur visuel de couleur au survol (pour les prénoms actifs) */}
                    {!name.isEliminated && (
                      <div
                        className={`
                          absolute inset-x-0 -bottom-1 h-1 rounded-full transition-all duration-300 group-hover:h-1.5
                          ${parseInt(name.id) % 4 === 0 ? "bg-gradient-to-r from-pink-400 to-rose-400" : ""}
                          ${parseInt(name.id) % 4 === 1 ? "bg-gradient-to-r from-blue-400 to-cyan-400" : ""}
                          ${parseInt(name.id) % 4 === 2 ? "bg-gradient-to-r from-emerald-400 to-teal-400" : ""}
                          ${parseInt(name.id) % 4 === 3 ? "bg-gradient-to-r from-amber-400 to-orange-400" : ""}
                        `}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FOOTER INFORMATIF */}
        <footer className="text-center space-y-2 pt-8 border-t border-white/20">
          <p className="text-sm text-slate-600">
            🔄 Les modifications sont synchronisées en temps réel avec la
            famille
          </p>
          <p className="text-xs text-slate-500">
            Dernière mise à jour : À l'instant
          </p>
        </footer>
      </div>
    </div>
  );
}
