# Toute l'équipe — Le rapport du jour

**Votre fichier :** `src/rapport.js` · **Vos tests :** `npm run test:rapport` (3 tests)

C'est l'étape où les quatre parties se rejoignent. Travaillez **à quatre sur un seul ordinateur** : une personne tape, les autres guident. Changez de clavier toutes les 15 minutes. Le commit final doit indiquer que c'est un travail d'équipe, par exemple :

```powershell
git commit -m "rapport : construireRapport et enregistrerRapport (travail d'équipe)"
```

Avant de commencer, `git pull` : il vous faut les fonctions de **tous** les membres.

## 1. `listerParEtat(alertes, etat)` — facile

**Reçoit :** les alertes du Membre 2 et un état comme `'ARROSER'`. **Renvoie :** les `id` correspondants séparés par une virgule et une espace, ou le texte `'aucune'`.

```js
listerParEtat(alertes, 'ARROSER') // → 'P02, P04'
listerParEtat(alertes, 'DRAINER') // → 'aucune' si aucune parcelle n'est à drainer
```

<details><summary>Aide</summary>

1. `filter` pour garder les bonnes alertes, puis `map` pour ne garder que leur `id`.
2. `['P02', 'P04'].join(', ')` donne `'P02, P04'`.
3. Si le tableau d'id est vide, renvoyez `'aucune'`.
</details>

## 2. `construireRapport(donnees, date)` — le cœur du projet

**Reçoit :** l'objet de `chargerDonnees` (`{ parcelles, cultures, releves, recoltes }`) et une date comme `'2026-10-29'`. **Renvoie :** **une seule chaîne** qui contient tout le rapport, exactement dans ce format :

```text
=== RAPPORT AGRISUIVI DU 2026-10-29 ===
Parcelles suivies : 8
Surface totale : 15.5 ha

--- Irrigation ---
À arroser : P02, P04
À drainer : P05, P08
Sans relevé : P07

--- Récoltes ---
Production totale : 26800 kg
Revenu estimé : 10650000 FCFA
Meilleure parcelle : P01 (Awa Diallo) avec 3300000 FCFA
```

Le texte se termine par un retour à la ligne (`\n`) après la dernière ligne. Les lignes vides sont importantes.

| Ligne | D'où vient l'information ? |
|---|---|
| Surface totale | `surfaceTotale` (Membre 1) |
| À arroser, À drainer, Sans relevé | `alertesIrrigation` (Membre 2) + `listerParEtat`, avec les états `'ARROSER'`, `'DRAINER'`, `'INCONNU'` |
| Production et revenu totaux | `bilanRecoltes` (Membre 3) + `reduce` |
| Meilleure parcelle | le premier élément de `classerParRevenu(...)` (Membre 3) |

<details><summary>Aide</summary>

1. Récupérez les quatre tableaux : `const { parcelles, cultures, releves, recoltes } = donnees;`
2. Calculez d'abord les valeurs dans des `const` : alertes, classement, totaux, meilleure parcelle.
3. Construisez un tableau de lignes :

   ```js
   const lignes = [
     `=== RAPPORT AGRISUIVI DU ${date} ===`,
     `Parcelles suivies : ${parcelles.length}`,
     // ...
   ];
   ```
4. Une ligne vide, c'est `''`.
5. `lignes.join('\n')` colle les lignes avec des retours à la ligne. Ajoutez un dernier `'\n'`.
6. Si le test échoue, lisez bien la différence affichée : souvent un espace ou un accent.
</details>

## 3. `enregistrerRapport(chemin, texte)` — facile

**Reçoit :** un chemin comme `sorties/rapport-2026-10-29.txt` et le texte. Crée le dossier s'il n'existe pas, puis écrit le fichier.

<details><summary>Aide</summary>

1. `dirname(chemin)` donne le dossier : `sorties`.
2. `await mkdir(dossier, { recursive: true });` crée le dossier, sans erreur s'il existe déjà.
3. `await writeFile(chemin, texte, 'utf8');`
</details>

## Vérifier

```powershell
npm run test:rapport
node app.js rapport
npm test
```

Objectif : **38 tests verts**. Seuls les 5 tests du bonus `station` peuvent rester rouges.

## Ensuite : vos propres tests et le débogueur

1. Chaque membre ajoute **au moins deux tests** dans son fichier de test : un cas limite et un cas d'erreur.
2. Ouvrez l'onglet **Exécuter et déboguer** de VS Code, choisissez **« Déboguer AgriSuivi : rapport »**, placez un point d'arrêt dans `construireRapport` et observez les valeurs des variables.
3. Le formateur relancera votre programme avec d'**autres données** : vérifiez qu'aucun résultat n'est écrit en dur.
