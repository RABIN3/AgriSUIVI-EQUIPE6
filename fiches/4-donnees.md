# Membre 4 — Données

**Votre fichier :** `src/donnees.js` · **Vos tests :** `npm run test:donnees` (10 tests)

Vous êtes le lien entre les fichiers et le programme : lire les JSON, vérifier ce que l'utilisateur tape, enregistrer un nouveau relevé. C'est la notion du jour : **promesses, `async` / `await`, `try` / `catch`**.

> **Commencez par `lireJson` puis `chargerDonnees`.** Toute l'équipe en a besoin pour lancer l'application. Prévenez les autres dès qu'elles sont poussées sur GitHub.

Les imports sont déjà écrits en haut du fichier : `readFile` et `writeFile` viennent de `node:fs/promises`, `join` de `node:path`.

## 1. `lireJson(chemin)` — moyen

**Reçoit :** un chemin de fichier. **Renvoie :** une **promesse** du contenu du fichier, converti avec `JSON.parse`.

Si la lecture ou la conversion échoue, lancez une erreur dont le message contient `Impossible de lire` et le chemin, **en gardant l'erreur d'origine** :

```js
throw new Error(`Impossible de lire ${chemin}`, { cause: erreur });
```

<details><summary>Aide</summary>

1. La fonction est `async` : elle renvoie toujours une promesse.
2. `const texte = await readFile(chemin, 'utf8');` attend le contenu du fichier.
3. `return JSON.parse(texte);`
4. Entourez ces deux lignes d'un `try { ... } catch (erreur) { ... }`.
</details>

## 2. `chargerDonnees(dossier)` — moyen

**Reçoit :** un dossier, par exemple `'./donnees'`. **Renvoie :** une promesse de l'objet :

```js
{ parcelles: [...], cultures: [...], releves: [...], recoltes: [...] }
```

Les quatre fichiers doivent être lus **en même temps** avec `Promise.all`.

<details><summary>Aide</summary>

1. `join(dossier, 'parcelles.json')` construit le chemin, sous Windows comme sous Linux.
2. `Promise.all([promesse1, promesse2, ...])` attend que **toutes** soient terminées.
3. On peut récupérer les résultats dans l'ordre :

   ```js
   const [parcelles, cultures, releves, recoltes] = await Promise.all([ ... ]);
   ```
4. Renvoyez `{ parcelles, cultures, releves, recoltes }`.
</details>

## 3. `creerReleve(parcelle, humiditeTexte, temperatureTexte, date)` — moyen

Dans le terminal, tout arrive sous forme de **texte**. Cette fonction vérifie ces textes et fabrique un relevé propre.

```js
creerReleve('p07', '64', '29', '2026-10-29')
// → { parcelle: 'P07', date: '2026-10-29', humidite: 64, temperature: 29 }
```

| Situation | Erreur à lancer (le message doit contenir…) |
|---|---|
| `parcelle` absente ou vide | … le mot **parcelle** |
| humidité qui n'est pas un nombre, ou hors de 0 à 100 | … le mot **humidité** |
| température qui n'est pas un nombre | … le mot **température** |

L'id de la parcelle est renvoyé **en majuscules**.

<details><summary>Aide</summary>

1. `if (!parcelle)` est vrai pour `undefined` et pour `''`.
2. `Number('64')` donne `64` ; `Number('abc')` donne `NaN`. Testez avec `Number.isNaN(...)`.
3. Combinez les conditions avec `||` : pas un nombre **ou** trop petit **ou** trop grand.
4. `'p07'.toUpperCase()` donne `'P07'`.
</details>

## 4. `ajouterReleve(chemin, releve)` — moyen

**Reçoit :** le chemin de `releves.json` et un relevé. Ajoute le relevé **à la fin** du fichier, enregistre le fichier, puis **renvoie** le nouveau nombre de relevés.

<details><summary>Aide</summary>

1. Réutilisez `lireJson` : `const releves = await lireJson(chemin);`
2. `releves.push(releve);`
3. `JSON.stringify(releves, null, 2)` produit un JSON lisible, avec indentation.
4. `await writeFile(chemin, texte, 'utf8');` : sans `await`, la fonction se termine avant l'écriture.
</details>

## Voir le résultat dans l'application

```powershell
node app.js parcelles
node app.js releve P07 64 29
node app.js releve P07 beaucoup 29
node app.js releve P99 50 30
```

Le premier relevé est accepté ; les deux suivants affichent un message `Erreur : ...` clair. Pour remettre le fichier d'origine : `git restore donnees/releves.json`.

Renommez un instant `donnees/recoltes.json`, lancez `node app.js rapport` et lisez le message : c'est votre `try` / `catch` qui l'a produit. Remettez ensuite le bon nom.

## Pour aller plus loin

- Ajoutez un test : `creerReleve('P07', '100', '29', ...)` est accepté (100 est une limite valide).
- Dans `chargerDonnees`, remplacez `Promise.all` par quatre `await` à la suite. Le résultat change-t-il ? Qu'est-ce qui change ?

## Préparez votre présentation

- Que renvoie une fonction `async` ? Que se passe-t-il si on oublie `await` devant `readFile` ?
- Pourquoi garder l'erreur d'origine dans `cause` ?
- Pourquoi `Promise.all` plutôt que quatre lectures l'une après l'autre ?
