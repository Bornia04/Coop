# Mode d'Emploi — CoopLedger

Bienvenue dans le guide d'utilisation de **CoopLedger**, votre plateforme de gouvernance et de gestion transparente pour coopératives agricoles. Ce document explique comment naviguer sur le site web, utiliser l'application mobile et comprendre l'interactivité entre les deux.

---

## 🏗️ Architecture du Design : "Premium Cards"

L'interface de CoopLedger utilise un système de **Premium Cards**. 
- **Visuel** : Les informations sont regroupées dans de grandes cartes blanches aux coins très arrondis (`rounded-2xl` / `40px`), sur un fond légèrement grisé ou sombre.
- **Interactivité** : Chaque champ de saisie (input) est conçu pour s'illuminer avec une bordure de couleur (la couleur primaire) lorsqu'il est sélectionné, offrant une expérience fluide et moderne.
- **Cohérence** : Nous avons supprimé les bordures carrées classiques pour privilégier des formes douces qui rappellent les applications mobiles haut de gamme.

---

##  Plateforme Web (Tableau de Bord)

Le site web est le centre de contrôle de la coopérative. Il se compose de plusieurs sections clés :

### 1. Dashboard (Tableau de Bord)
C'est ici que vous voyez l'état global de la coopérative :
- **Statistiques** : Solde de la caisse, nombre de membres actifs, et total des investissements.
- **Graphiques** : Visualisation des dépenses et des revenus en temps réel.

### 2. Gestion des Propositions
C'est le cœur de la démocratie de la coopérative :
- **Création** : Vous pouvez soumettre une "Nouvelle Proposition" (ex: achat de semences).
- **Format Card** : Le formulaire est centré et utilise le design "Premium Card" pour une saisie agréable.
- **Sécurisation** : Chaque proposition est signée numériquement (le "Scellage"). Une fois envoyée, elle est enregistrée de manière immuable.

### 3. Analyses & Rapports
Visualisez l'impact de chaque dépense sur la productivité de la coopérative grâce à des rapports détaillés.

---

## Application Mobile (Vote en Temps Réel)

L'application mobile est l'outil quotidien des membres pour participer aux décisions.

### 1. Consultation des Propositions
Les membres reçoivent instantanément les nouvelles propositions créées sur le web.

### 2. Vote Interactif
- **Action** : Les membres peuvent voter "Pour" ou "Contre" directement depuis leur téléphone.
- **Interactivité Web/Mobile** : Dès qu'un membre vote sur son mobile, le compteur de votes sur le tableau de bord web se met à jour instantanément.
- **Urgences** : Certaines propositions peuvent être marquées comme "Urgentes" avec un délai de vote très court (ex: 1 minute) pour des décisions rapides.

---

##  Comment l'interactivité fonctionne ?

1. **Soumission** : Le Président crée une proposition sur le **Web**.
2. **Notification** : La proposition apparaît immédiatement sur le **Mobile** de tous les membres.
3. **Engagement** : Les membres votent sur le **Mobile**.
4. **Validation** : Le résultat du vote est renvoyé au **Web** qui valide ou refuse la dépense automatiquement.
5. **Transparence** : Chaque étape est enregistrée avec un code de sécurité unique (Hash) garantissant qu'aucune donnée n'a été modifiée.

## 🔔 Système de Notifications Temps Réel

CoopLedger intègre un système d'alertes instantanées pour garantir une réactivité maximale :

- **Sur le Web** : Des bannières (Toasts) apparaissent en haut à droite pour vous informer de chaque nouvel événement :
    - Confirmation d'une transaction scellée.
    - Ouverture d'un nouveau vote.
    - Distribution de primes aux membres.
    - Nouveau bloc ajouté au Ledger.
- **Sur Mobile** : Des notifications internes (SnackBars) vous alertent dès qu'une proposition est créée, vous permettant de voter immédiatement.
- **Feedback Immédiat** : Chaque action (envoi de formulaire, vote, scellage) déclenche un retour visuel confirmant le succès de l'opération.

---

## Astuces d'Utilisation
- **Saisie de texte** : Les champs de texte s'adaptent à la taille de votre contenu.
- **Navigation** : Utilisez la barre latérale gauche sur le web pour passer rapidement d'un outil à l'autre.
- **Statut** : Gardez un œil sur le bandeau "Gouvernance" pour voir les transactions en cours de validation.

---
