# Modeste PRINTLAB — site de blouses personnalisées

Site statique en HTML, CSS et JavaScript. Il n'y a pas de compte client ni de paiement en ligne.
La commande ouvre WhatsApp avec un message prérempli ; le client doit appuyer sur Envoyer.

## 1. Contenu du dossier

- `index.html` : structure et textes de la page.
- `css/style.css` : couleurs, mise en page et adaptation aux téléphones.
- `js/config.js` : nom de la boutique, numéro WhatsApp et paramètres publics Supabase.
- `js/script.js` : menu, prix, formulaire de commande et lien WhatsApp.
- `js/avis.js` : affichage et soumission des avis.
- `supabase/schema.sql` : table des avis et règles de sécurité.
- `assets/images/` : tes photos, ton logo et ton flyer.

## 2. Avant de publier : personnaliser les images

Dans `assets/images/`, remplace les fichiers d'exemple par tes vraies images en gardant ces noms :
- `blouse-polyester.jpg`
- `blouse-coton.jpg`
- `flyer.jpg`
- `logo.png` (emplacement réservé ; le logo n'est pas encore affiché automatiquement)

Conseils : utilise des photos nettes, bien éclairées, idéalement au format JPG/WebP et pas trop lourdes. N'utilise pas de photos dont tu n'as pas le droit de te servir.

Si tu n'as pas encore les photos, les emplacements colorés s'affichent à la place.

## 3. Configurer le numéro WhatsApp

Ouvre `js/config.js`. Remplace `237XXXXXXXXX` par le numéro du vendeur, chiffres uniquement.
Exemple de format : `2376XXXXXXXX` (remplace les X par les chiffres réels du numéro).

Le formulaire produit un message qui contient :
- nom du client ;
- nom à floquer ;
- école ;
- taille ;
- matière et prix ;
- texte de promotion facultatif.

Le site ne transmet pas la commande à un serveur : le message est prérempli dans WhatsApp et le client doit l'envoyer lui-même.

## 4. Configurer Supabase pour les avis

Tu peux publier le site avant cette étape, mais le stockage des avis ne fonctionnera pas tant que Supabase n'est pas configuré.

1. Crée un compte sur https://supabase.com/ et crée un nouveau projet.
2. Dans le projet, ouvre **SQL Editor**, puis **New query**.
3. Copie le contenu de `supabase/schema.sql` dans l'éditeur et exécute-le.
4. Dans les paramètres du projet, trouve l'URL du projet et la clé publique appelée **publishable key** (ou la clé `anon` dans les anciennes interfaces).
5. Ouvre `js/config.js` et renseigne `supabaseUrl` et `supabaseKey`.
6. Enregistre, puis teste le site. Un avis envoyé doit rester en attente et ne pas apparaître publiquement tout de suite.

### Sécurité Supabase à retenir

- L'URL du projet et la clé **publishable/anon** sont prévues pour une utilisation dans le navigateur, avec les règles SQL/RLS ci-dessus.
- Ne mets JAMAIS une clé `service_role` ou une clé `secret` dans `js/config.js`, GitHub ou le site public.
- La clé publique n'est pas un mot de passe : les règles RLS et les droits SQL contrôlent ce que les visiteurs peuvent faire.
- Les visiteurs peuvent lire les avis publiés et insérer des avis avec le statut `pending`. Ils ne peuvent pas changer le statut en `published` depuis le site.
- La modération manuelle se fait dans le tableau de bord Supabase : table `avis`, ligne concernée, colonne `statut`, valeur `published` pour publier ou `rejected` pour refuser.
- Les règles limitent les champs, mais un site public peut toujours recevoir du spam. Pour un usage réel, surveille les avis et envisage ensuite un mécanisme anti-spam plus avancé.

## 5. Tester le site sur Ubuntu

Depuis le terminal, place-toi dans le dossier du projet, puis lance :

```bash
python3 -m http.server 8000
```

Ouvre ensuite `http://localhost:8000` dans ton navigateur.
Pour arrêter le serveur de test : `Ctrl + C`.

Évite d'ouvrir seulement le fichier HTML en double-cliquant dessus : le serveur local rend les tests plus proches d'un site publié.

## 6. Publier gratuitement avec GitHub Pages

GitHub Pages héberge les fichiers HTML/CSS/JavaScript statiques.

1. Crée un dépôt GitHub, par exemple `modeste-printlab`.
2. Envoie les fichiers du dossier dans le dépôt.
3. Sur GitHub, ouvre **Settings > Pages**.
4. Dans la source de publication, choisis la branche `main` et le dossier `/ (root)`, puis enregistre.
5. Attends la fin de la publication et ouvre l'adresse fournie par GitHub Pages.

Le site reste statique. Supabase héberge les avis séparément. Si tu utilises un dépôt public, considère que le code et `js/config.js` sont visibles par tous : ne mets aucun secret dedans.

## 7. Modifier les prix et les textes

Les prix sont définis dans `js/script.js`, dans cet objet :

```javascript
const prices = { Polyester: 3999, Coton: 4999 };
```

Les prix affichés sur les cartes sont aussi écrits dans `index.html`. Si tu changes les prix, modifie les deux endroits.

Les écoles, les tailles, les textes et les sections se trouvent dans `index.html`.
Les couleurs principales se trouvent au début de `css/style.css`, dans `:root`.

## 8. Limites de cette première version

- Pas de panier ni de paiement en ligne.
- Pas de compte client.
- Le site ne sait pas vérifier automatiquement qu'une personne a réellement acheté une blouse.
- Les avis sont publics uniquement après validation manuelle.
- Le formulaire WhatsApp ouvre un message prêt à envoyer ; il ne l'envoie pas à la place du client.
- Le numéro WhatsApp, les photos et les paramètres Supabase doivent être renseignés avant que toutes les fonctions soient actives.
# Modeste-PRINTLAB
