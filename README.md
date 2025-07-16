# Front-Aquarhone - Application Next.js

Application frontend Next.js pour la gestion des activités aquatiques et des réservations.

## Prérequis

- Node.js 18 ou supérieur
- npm, yarn, pnpm ou bun

## Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd front-aquarhone
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

L'application sera accessible sur `http://localhost:3000`

## Configuration

L'application est configurée pour communiquer avec l'API Symfony sur `http://localhost:8000`.

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Fonctionnalités

### 🔐 Authentification
- **Inscription** : Création de compte utilisateur
- **Connexion** : Authentification avec JWT
- **Protection des routes** : Accès contrôlé selon les rôles
- **Gestion des tokens** : Stockage sécurisé des tokens JWT

### 🏊‍♂️ Gestion des activités
- **Liste des activités** : Affichage de toutes les activités disponibles
- **Filtrage** : Recherche par type d'activité
- **Détails d'activité** : Informations complètes sur chaque activité
- **Réservation** : Système de réservation sur créneau

### 📅 Gestion des réservations
- **Historique** : Consultation de toutes ses réservations
- **Annulation** : Possibilité d'annuler une réservation
- **Statuts** : Suivi des réservations (en attente, confirmée, annulée)

### 👨‍💼 Interface administrateur
- **Gestion des activités** : CRUD complet des activités
- **Gestion des utilisateurs** : CRUD complet des utilisateurs
- **Tableau de bord** : Vue d'ensemble du système

## Structure du projet

```
front-aquarhone/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   └── page.tsx          # Page d'authentification
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Tableau de bord utilisateur
│   │   ├── activities/
│   │   │   ├── page.tsx          # Liste des activités
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Détail d'une activité
│   │   ├── reservations/
│   │   │   └── page.tsx          # Historique des réservations
│   │   ├── admin/
│   │   │   ├── activities/
│   │   │   │   └── page.tsx      # Gestion admin des activités
│   │   │   └── users/
│   │   │       └── page.tsx      # Gestion admin des utilisateurs
│   │   ├── layout.tsx            # Layout principal
│   │   ├── page.tsx              # Page d'accueil
│   │   └── globals.css           # Styles globaux
│   ├── components/
│   │   ├── AuthGuard.tsx         # Protection des routes
│   │   ├── Navigation.tsx        # Navigation principale
│   │   └── ui/                   # Composants UI réutilisables
│   └── lib/
│       └── api.ts                # Service API centralisé
├── public/                       # Assets statiques
└── package.json
```

## Pages disponibles

### Pages publiques
- **`/`** : Page d'accueil avec présentation et lien vers l'authentification

### Pages d'authentification
- **`/auth`** : Formulaire de connexion/inscription

### Pages utilisateur (nécessitent une authentification)
- **`/dashboard`** : Tableau de bord utilisateur
- **`/activities`** : Liste des activités disponibles
- **`/activities/[id]`** : Détail d'une activité avec réservation
- **`/reservations`** : Historique des réservations

### Pages administrateur (nécessitent le rôle ADMIN)
- **`/admin/activities`** : Gestion des activités (CRUD)
- **`/admin/users`** : Gestion des utilisateurs (CRUD)

## Rôles et permissions

### Rôle USER
- Consultation des activités
- Réservation d'activités
- Gestion de ses réservations
- Accès au tableau de bord personnel

### Rôle ADMIN
- Toutes les permissions USER
- Gestion complète des activités
- Gestion complète des utilisateurs
- Accès aux interfaces d'administration

## Technologies utilisées

- **Next.js 14** : Framework React avec App Router
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS utilitaire
- **React Hook Form** : Gestion des formulaires
- **Zod** : Validation des données
- **JWT** : Authentification sécurisée

## API Backend

L'application communique avec l'API Symfony via le service `src/lib/api.ts` qui centralise tous les appels API :

- **Authentification** : `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Activités** : `/api/activities`
- **Réservations** : `/api/reservations`
- **Utilisateurs** : `/api/users` (admin uniquement)

## Développement

### Commandes utiles

```bash
# Démarrer le serveur de développement
npm run dev

# Build de production
npm run build

# Lancer en mode production
npm start

# Linter
npm run lint

# Type checking
npm run type-check
```

### Structure des composants

#### AuthGuard
Protège les routes nécessitant une authentification. Redirige vers `/auth` si l'utilisateur n'est pas connecté.

#### Navigation
Composant de navigation qui affiche les liens selon le rôle de l'utilisateur connecté.

#### Service API
Le fichier `src/lib/api.ts` centralise tous les appels à l'API backend avec :
- Gestion des tokens JWT
- Gestion des erreurs
- Types TypeScript
- Validation des réponses

## Dépannage

### Problèmes de connexion à l'API
1. Vérifiez que le backend Symfony est démarré sur `http://localhost:8000`
2. Vérifiez que le serveur Symfony est en mode HTTP (`--no-tls`)
3. Vérifiez la configuration CORS dans le backend

### Problèmes d'authentification
1. Vérifiez que les tokens JWT sont bien stockés dans le localStorage
2. Vérifiez que l'utilisateur existe dans la base de données backend
3. Vérifiez les clés JWT dans le backend

### Problèmes de build
1. Vérifiez que toutes les dépendances sont installées : `npm install`
2. Vérifiez les erreurs TypeScript : `npm run type-check`
3. Vérifiez le linter : `npm run lint`

## Déploiement

### Vercel (recommandé)
1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Autres plateformes
L'application peut être déployée sur n'importe quelle plateforme supportant Next.js :
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Support

Pour toute question ou problème :
1. Vérifiez la documentation Next.js
2. Consultez les logs de développement
3. Vérifiez la configuration backend
