# 🚀 Quick Start Guide - Crèche SaaS API

## 📋 Prérequis

- Node.js 16+
- PostgreSQL 12+
- npm ou yarn
- Postman (optionnel)

---

## 🔧 Installation

### 1. Cloner le projet
```bash
git clone github.com:wlw-tech/creche-saas.git
cd creche-saas/creche-api
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement
```bash
# Créer .env.local
cp .env.example .env.local

# Éditer .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/creche_db
JWT_SECRET=dev_secret
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
NODE_ENV=development
```

### 4. Initialiser la base de données
```bash
# Créer la base de données
npx prisma migrate dev --name init

# Seed data (optionnel)
npx prisma db seed
```

### 5. Démarrer le serveur
```bash
npm run start:dev
```

Le serveur démarre sur `http://localhost:3000`

---

## 📚 Documentation

### Fichiers Importants
1. **PROJECT_OVERVIEW.md** - Vue d'ensemble du projet
2. **PARENT_DASHBOARD_GUIDE.md** - Guide Parent Dashboard
3. **TECHNOLOGY_STACK.md** - Stack technologique
4. **INSCRIPTIONS_UPDATED_DOCUMENTATION.md** - Inscriptions
5. **IMPLEMENTATION_SUMMARY.md** - Résumé d'implémentation

### Postman
Importer la collection: `Creche-Complete-API.postman_collection.json`

---

## 🧪 Tester les Endpoints

### 1. Soumettre une Candidature (Public)
```bash
curl -X POST http://localhost:3000/api/public/inscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "famille": {
      "emailPrincipal": "parent@example.com",
      "languePreferee": "fr"
    },
    "tuteurs": [
      {
        "lien": "Mere",
        "prenom": "Sara",
        "nom": "El Idrissi",
        "email": "parent@example.com",
        "telephone": "+212612345678",
        "principal": true
      }
    ],
    "enfant": {
      "prenom": "Mohammed",
      "nom": "Bennani",
      "dateNaissance": "2022-06-14"
    },
    "classeIdSouhaitee": "cls_1"
  }'
```

### 2. Lister les Inscriptions (Admin)
```bash
# Générer un JWT token avec role: ADMIN
# Voir PARENT_DASHBOARD_GUIDE.md pour générer un token

curl -H "Authorization: Bearer <ADMIN_JWT>" \
  "http://localhost:3000/api/admin/inscriptions?statut=CANDIDATURE"
```

### 3. Accepter une Inscription (Admin)
```bash
curl -X POST \
  -H "Authorization: Bearer <ADMIN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{"notes":"Accepté"}' \
  http://localhost:3000/api/admin/inscriptions/<INSCRIPTION_ID>/accept
```

**Résultat**: Email envoyé au parent avec credentials

### 4. Se Connecter (Parent)
```bash
curl -X POST http://localhost:3000/api/auth/login-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@example.com",
    "password": "<TEMP_PASSWORD_FROM_EMAIL>"
  }'
```

**Résultat**: JWT token retourné

### 5. Récupérer le Profil Parent
```bash
curl -H "Authorization: Bearer <PARENT_JWT>" \
  http://localhost:3000/api/parent/me
```

---

## 🔑 Générer un JWT Token (DEV)

### Utiliser jwt.io
1. Aller sur https://jwt.io
2. Payload:
```json
{
  "userId": "user_123",
  "email": "parent@example.com",
  "role": "PARENT"
}
```
3. Secret: `dev_secret`
4. Copier le token généré

### Ou utiliser Node.js
```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  {
    userId: 'user_123',
    email: 'parent@example.com',
    role: 'PARENT'
  },
  'dev_secret',
  { expiresIn: '24h' }
);

console.log(token);
```

---

## 📧 Tester les Emails

### Configuration Gmail
1. Activer "Less secure app access" sur Gmail
2. Ou générer un "App Password"
3. Ajouter à `.env.local`:
```
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
```

### Vérifier les Emails
- Les emails sont envoyés lors de l'acceptation d'une inscription
- Vérifier la boîte de réception du parent
- Contient: email, mot de passe temporaire, lien de connexion

---

## 🐛 Dépannage

### Erreur: "Database connection failed"
```bash
# Vérifier que PostgreSQL est en cours d'exécution
# Vérifier DATABASE_URL dans .env.local
# Créer la base de données si nécessaire
createdb creche_db
```

### Erreur: "JWT invalid"
```bash
# Vérifier que le token est valide
# Vérifier que JWT_SECRET correspond
# Vérifier que le token n'a pas expiré
```

### Erreur: "Email not sent"
```bash
# Vérifier GMAIL_USER et GMAIL_PASSWORD
# Vérifier que Gmail "Less secure apps" est activé
# Vérifier les logs du serveur
```

### Erreur: "403 Forbidden"
```bash
# Vérifier que le JWT contient le bon rôle
# Vérifier que l'utilisateur existe en base de données
# Vérifier que le tuteur est lié à l'utilisateur
```

---

## 📊 Commandes Utiles

### Développement
```bash
# Démarrer en mode watch
npm run start:dev

# Build
npm run build

# Tests
npm run test

# Linter
npm run lint
```

### Base de Données
```bash
# Créer une migration
npx prisma migrate dev --name <name>

# Voir la base de données
npx prisma studio

# Seed data
npx prisma db seed

# Reset (attention!)
npx prisma migrate reset
```

### Git
```bash
# Voir les commits
git log --oneline

# Voir les changements
git diff

# Pousser les changements
git push origin main
```

---

## 🎯 Checklist - Avant de Déployer

- [ ] `.env.local` configuré
- [ ] Base de données créée et migrée
- [ ] Serveur démarre sans erreur
- [ ] Endpoints testés avec Postman
- [ ] Emails envoyés correctement
- [ ] JWT tokens valides
- [ ] RBAC fonctionne (403 si accès non autorisé)
- [ ] Tous les tests passent
- [ ] Code pushé sur GitHub

---

## 📞 Support

### Ressources
- **GitHub**: github.com:wlw-tech/creche-saas.git
- **API Docs**: http://localhost:3000/api/docs
- **Postman**: Importer `Creche-Complete-API.postman_collection.json`

### Documentation
- Voir les fichiers `.md` dans le répertoire racine
- Voir les commentaires dans le code source

---

## 🎉 Prochaines Étapes

1. ✅ Tester tous les endpoints
2. ✅ Vérifier les emails
3. ✅ Implémenter le frontend
4. ✅ Configurer Supabase (production)
5. ✅ Déployer sur un serveur

**Bon développement!** 🚀

