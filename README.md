# AgroAfrica - Le Grand Marché Agricole & Artisanal Africain

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.13-38B2AC?logo=tailwind-css)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.2.7-764ABC?logo=redux)

## 📋 Description

AgroAfrica est une plateforme e-commerce moderne dédiée au marché agricole et artisanal africain. Elle permet aux agriculteurs et artisans de vendre leurs produits directement aux consommateurs, avec un accent particulier sur les solutions de paiement mobile adaptées au contexte africain (Mobile Money).

## ✨ Fonctionnalités

### Pour les Clients
- 🛒 **Catalogue de produits** : Parcourez une large gamme de produits agricoles et artisanaux
- 🔍 **Recherche et filtres** : Trouvez facilement les produits par catégorie, prix, localisation
- 🛍️ **Panier d'achat** : Gérez vos achats avec un panier persistant
- 💳 **Paiement Mobile Money** : Intégration avec les opérateurs Mobile Money africains
- 📱 **Interface responsive** : Optimisé pour mobile, tablette et desktop
- 🌓 **Mode sombre/clair** : Basculez entre les thèmes selon vos préférences

### Pour les Vendeurs
- 📦 **Gestion des produits** : Ajoutez, modifiez et supprimez vos produits
- 📊 **Tableau de bord** : Suivez vos ventes et performances
- 📦 **Gestion des commandes** : Traitez et suivez les commandes clients
- 💰 **Suivi des revenus** : Visualisez vos gains et transactions

### Pour les Administrateurs
- 👥 **Gestion des utilisateurs** : Administrez les comptes clients et vendeurs
- ✅ **Validation des produits** : Modérez le contenu publié
- 📈 **Statistiques globales** : Vue d'ensemble de la plateforme
- ⚙️ **Paramètres système** : Configurez la plateforme

## 🛠️ Technologies Utilisées

### Frontend
- **React 18.3.1** - Bibliothèque UI
- **Vite 5.4.8** - Build tool et dev server
- **Redux Toolkit 2.2.7** - Gestion d'état
- **React Router 6.27.0** - Routing
- **TailwindCSS 3.4.13** - Styling
- **Lucide React 0.460.0** - Icônes
- **Axios 1.7.7** - Requêtes HTTP

### Outils de Développement
- **ESLint 9.12.0** - Linting
- **Prettier 3.3.3** - Formatage de code
- **Vite Plugin PWA** - Progressive Web App

## 📦 Installation

### Prérequis
- Node.js >= 18.x
- npm >= 9.x

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/ismaeldaniel653-droid/agroafrica-frontend.git
cd agroafrica-frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```
Modifiez le fichier `.env` avec vos configurations :
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=AgroAfrica
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 🚀 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Build l'application pour la production |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run lint:fix` | Corrige automatiquement les erreurs ESLint |
| `npm run format` | Formate le code avec Prettier |
| `npm run check` | Lance le lint et le build |
| `npm run clean` | Nettoie les fichiers de build |
| `npm run seed` | Peuple la base de données |
| `npm run seed:local` | Peuple la base de données en local |

## 🏗️ Structure du Projet

```
agroafrica-frontend/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── common/         # Composants communs (ThemeToggle, etc.)
│   │   ├── layout/         # Layout components (Header, Footer, etc.)
│   │   ├── product/        # Composants liés aux produits
│   │   └── cart/           # Composants du panier
│   ├── pages/              # Pages de l'application
│   │   ├── Home/           # Page d'accueil
│   │   ├── Products/       # Catalogue produits
│   │   ├── Cart/           # Panier d'achat
│   │   ├── Checkout/       # Processus de commande
│   │   ├── Admin/          # Interface administrateur
│   │   └── Auth/           # Authentification
│   ├── contexts/           # Contextes React
│   │   └── ThemeContext.jsx
│   ├── store/              # Redux store et slices
│   ├── services/           # Services API
│   ├── utils/              # Fonctions utilitaires
│   ├── hooks/              # Custom hooks
│   ├── App.jsx             # Composant principal
│   └── main.jsx            # Point d'entrée
├── public/                 # Assets statiques
├── scripts/                # Scripts utilitaires
├── package.json
├── vite.config.js
├── tailwind.config.js
├── vercel.json
└── README.md
```

## 🎨 Design System

### Couleurs
- **Primaire** : Vert agriculture (#22c55e)
- **Secondaire** : Orange (#f97316)
- **Fond sombre** : Gris foncé (#1f2937)
- **Fond clair** : Blanc cassé (#f9fafb)

### Typographie
- **Police principale** : Inter (Google Fonts)
- **Tailles** : Échelle modulaire responsive

### Responsive Breakpoints
- Mobile : < 640px
- Tablet : 640px - 1024px
- Desktop : > 1024px

## 🔧 Configuration

### Vite
Le fichier `vite.config.js` configure :
- Plugin React avec Fast Refresh
- Alias de chemins pour les imports
- Build optimisé pour la production

### TailwindCSS
Configuration dans `tailwind.config.js` :
- Couleurs personnalisées
- Thème sombre/clair
- Responsive breakpoints
- Plugins personnalisés

### Redux
Store configuré avec :
- Redux Toolkit
- Redux Persist pour la persistance du panier
- Slices pour : cart, auth, products, user

## 🌍 Déploiement

### Vercel (Recommandé)

1. **Pousser le code sur GitHub**
```bash
git add .
git commit -m "feat: initial commit"
git push origin main
```

2. **Déployer sur Vercel**
```bash
npm install -g vercel
vercel
```

Ou via l'interface Vercel :
- Connectez votre repository GitHub
- Configurez les variables d'environnement
- Déployez

### Variables d'environnement de production
```env
VITE_API_BASE_URL=https://votre-api.com/api
VITE_APP_NAME=AgroAfrica
```

## 🧪 Tests

```bash
# Linter
npm run lint

# Build
npm run build

# Vérification complète
npm run check
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez :

1. Forker le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Pousser vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développeur Principal** : Ismaël Daniel
- **Design** : AgroAfrica Design Team
- **Backend** : AgroAfrica Backend Team

## 📞 Contact

Pour toute question ou suggestion :
- 📧 Email : contact@agroafrica.com
- 🌐 Site web : https://agroafrica.com
- 📱 Twitter : [@agroafrica](https://twitter.com/agroafrica)

## 🙏 Remerciements

- La communauté React et Vite
- TailwindCSS pour le framework CSS
- Tous les contributeurs et testeurs

---

**Fait avec ❤️ pour l'Afrique et par l'Afrique**

⭐ Si ce projet vous est utile, n'hésitez pas à lui donner une étoile !