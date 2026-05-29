# babycase

Un jeu de piste web interactif où la famille et les proches mènent l'enquête pour deviner le prénom du futur bébé à l'aide d'indices et d'une grille d'élimination.

---

## Comment ça marche ? (Le Déroulement du Jeu)

L'application transforme l'annonce du prénom en une enquête interactive séparée en deux rôles :

### 1. Le Créateur (Les Parents)

- Il choisit et enregistre le vrai prénom du bébé, qui reste totalement secret dans la base de données.
- L'application génère un lien d'invitation unique à envoyer aux proches par SMS ou messagerie.
- Il prépare une liste d'indices (ex: "Le prénom fait entre 3 et 5 lettres", "Il commence par une voyelle") et peut programmer leur publication automatique au fil des semaines.

### 2. Les Chercheurs (La Famille et les Amis)

- En cliquant sur le lien unique, ils accèdent à leur espace de jeu où ils découvrent les indices déjà débloqués et un compte à rebours avant le prochain indice.
- Sous les indices s'affiche une grille contenant entre 300 et 500 prénoms.
- **Le cœur du jeu :** Au fur et à mesure que les indices sont révélés, les chercheurs analysent la liste. D'un simple clic sur l'écran, ils "grisent" et barrent les prénoms qui ne correspondent pas aux critères.
- À force d'éliminations, la grille se vide jusqu'à ce qu'il ne reste plus qu'un seul prénom : la bonne réponse.

## Fonctionnalités clés (MVP)

- **Grille Mobile-First :** Interface optimisée spécifiquement pour que les proches puissent jouer confortablement sur leur smartphone.
- **Élimination Tactile Intuitive :** Un clic pour barrer/griser un prénom, un second clic pour le réactiver en cas d'erreur de manipulation.
- **Sauvegarde Automatique Locale :** L'état de la grille (les prénoms éliminés) est sauvegardé directement dans le navigateur du joueur (`localStorage`). S'il ferme l'onglet, il retrouve sa progression exacte plus tard.
- **Gestionnaire du Suspense :** Affichage dynamique des indices débloqués et système de verrouillage visuel sur les indices futurs pour inciter les proches à revenir sur le site.

## Stack Technique

- **Backend :** Node.js
- **Base de données & Authentification :** Supabase (PostgreSQL)
