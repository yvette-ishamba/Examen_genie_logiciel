# Congo Tax App 🇨🇩

**Congo Tax App** est une plateforme moderne et sécurisée de gestion et de suivi de la collecte des taxes de marché. Elle permet d'automatiser le processus de collecte, de surveiller la conformité fiscale des vendeurs et de générer des rapports analytiques pour la prise de décision.

## 🚀 Fonctionnalités Clés

### 1. Tableau de Bord (Dashboard)
Une vue d'ensemble en temps réel des recettes collectées, avec des indicateurs de croissance, le nombre de vendeurs actifs et les alertes sur les impayés.
![Dashboard](./screenshots/dashboard.png)

### 2. Gestion des Vendeurs & Matrice de Conformité
Un système rigoureux de suivi des paiements. La matrice affiche le statut de conformité pour chaque période (Journalier, Mensuel, Annuel).
- **EN RETARD** : Indique qu'un paiement manque depuis la date de création du compte.
- **À JOUR** : Confirmation que toutes les taxes dues ont été réglées.
![Gestion des Vendeurs](./screenshots/vendeurs.png)

### 3. Rapports Décisionnels (Analytique)
Des outils visuels pour l'Autorité Locale :
- Distribution des recettes par marché géographique.
- Taux de conformité global.
- Performance des agents collecteurs (Top agents).
- Répartition des flux financiers par catégorie de taxe.
![Rapports Décisionnels](./screenshots/rapports.png)

### 4. Configuration des Taxes
Interface intuitive pour définir les types de taxes, leurs montants de base et leurs fréquences de collecte. Supporte également les taxes "Occasionnelles" à prix libre.
![Configuration des Taxes](./screenshots/taxes.png)

### 5. Journal des Collectes
Historique complet et détaillé de toutes les transactions effectuées sur le terrain, permettant une traçabilité totale des fonds.
![Journal des Collectes](./screenshots/collecte.png)

## 🛠️ Stack Technique

- **Frontend** : React 19, TypeScript, Tailwind CSS, Chart.js.
- **Backend** : FastAPI (Python), SQLAlchemy (ORM).
- **Base de données** : MySQL.
- **Sécurité** : Authentification OAuth2 avec JWT, Hachage des mots de passe avec Bcrypt.

## ⚙️ Installation & Configuration

### Prérequis
- Python 3.10+
- Node.js 18+
- Serveur MySQL

### 1. Configuration du Backend
1. Accédez au dossier backend : `cd Backend`
2. Créez un environnement virtuel : `python -m venv venv`
3. Activez l'environnement : `venv\Scripts\activate` (Windows) ou `source venv/bin/activate` (Linux/Mac)
4. Installez les dépendances : `pip install -r requirements.txt`
5. Configurez le fichier `.env` avec vos accès MySQL :
   ```env
   DATABASE_URL=mysql+pymysql://user:password@localhost:3306/taxe_app_db
   SECRET_KEY=votre_cle_secrete_ici
   ```
6. Exécutez les migrations pour initialiser la base de données : `python app/migrations/migrate_v2.py`
7. Lancez le serveur : `uvicorn app.main:app --reload`

### 2. Configuration du Frontend
1. Accédez au dossier frontend : `cd FrontEnds`
2. Installez les dépendances : `npm install`
3. Lancez l'application en mode développement : `npm run dev`

## 🏗️ Architecture du Projet

```text
├── Backend/
│   ├── app/
│   │   ├── models/      # Modèles de données SQLAlchemy
│   │   ├── routes/      # Endpoints de l'API (FastAPI)
│   │   ├── schemas/     # Schémas Pydantic (Validation)
│   │   └── migrations/  # Scripts de migration de la base de données
│   └── main.py          # Point d'entrée de l'application
├── FrontEnds/
│   ├── src/
│   │   ├── components/  # Composants UI réutilisables
│   │   ├── pages/       # Vues principales (Dashboard, Vendeurs, etc.)
│   │   ├── services/    # Appels API
│   │   └── store/       # Gestion d'état (Redux Toolkit)
│   └── index.html
└── screenshots/         # Captures d'écran pour la documentation
```

## 👥 Rôles et Autorisations

Le système utilise un contrôle d'accès basé sur les rôles (RBAC) :

- **Autorité Locale (Administrateur)** : Accès complet aux rapports décisionnels, validation des nouveaux membres, gestion des taxes et surveillance globale.
- **Agent de Collecte** : Enregistrement des paiements sur le terrain, consultation de l'historique des collectes et signalement d'incidents.
  - *Processus de paiement* : Sélection de la taxe et saisie du montant.
  ![Formulaire de Paiement](./screenshots/agent_payment_form.png)
  - *Confirmation* : Validation instantanée de la transaction.
  ![Succès Paiement](./screenshots/agent_payment_success.png)

- **Vendeur** : Accès personnel pour consulter son statut de conformité et télécharger ses reçus de paiement.
  - *Historique & Reçus* : Suivi détaillé de toutes les taxes payées.
  ![Historique Vendeur](./screenshots/vendeur_history.png)
  - *Signalements* : Possibilité de rapporter des problèmes directement depuis l'interface.
  ![Modal de Signalement](./screenshots/vendeur_report_modal.png)

## 📱 Utilisation

L'application est optimisée pour une utilisation sur desktop (pour l'administration) et sur mobile (pour les agents de collecte sur le terrain). Les interfaces sont entièrement responsive pour garantir une expérience utilisateur fluide sur tous les supports.

## 📄 Licence

Ce projet est réalisé dans le cadre de l'Examen de Génie Logiciel.


