# Front-Aquarhone - Application Next.js

Application frontend Next.js pour la gestion des activités aquatiques et des réservations.

## 🚀 Démarrage rapide

### 1. Installation
```bash
# Cloner le projet
git clone git@github.com:Dev02JL/my-front-aquarhone.git
cd front-aquarhone

# Installer les dépendances
npm install
```

### 2. Configuration
```bash
# Créer le fichier d'environnement
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
```

### 3. Lancer l'application
```bash
# Démarrer le serveur de développement
npm run dev
```

L'application est accessible sur `http://localhost:3000`

## 🔑 Comptes de test

- **Admin :** `superadmin@aquarhone.com` / `admin123`

## 📱 Pages disponibles

### Pages publiques
- **`/`** - Page d'accueil

### Authentification
- **`/auth`** - Connexion/Inscription

### Utilisateur
- **`/dashboard`** - Tableau de bord
- **`/activities`** - Liste des activités
- **`/activities/[id]`** - Détail + réservation
- **`/reservations`** - Mes réservations

### Admin
- **`/admin/activities`** - Gestion des activités
- **`/admin/users`** - Gestion des utilisateurs

## 🔧 Configuration

L'application communique avec l'API Symfony sur `http://localhost:8000`.

### Variables d'environnement
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📁 Structure

```
src/
├── app/              # Pages Next.js (App Router)
├── components/       # Composants réutilisables
└── lib/
    └── api.ts       # Service API centralisé
```

## 🛠️ Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Linter
npm run lint

# Type checking
npm run type-check
```

## 🎯 Fonctionnalités

- **Authentification JWT** avec protection des routes
- **Gestion des activités** avec réservation sur créneaux
- **Interface admin** pour la gestion complète
- **Responsive design** avec Tailwind CSS
- **TypeScript** pour la sécurité du code
