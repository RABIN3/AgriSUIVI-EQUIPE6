# Membre 1 — Parcelles

**Votre fichier :** `src/parcelles.js` · **Vos tests :** `npm run test:parcelles` (8 tests)

Vous répondez aux questions : *quelles parcelles avons-nous ? de quelle culture ? quelle surface au total ?*

## Les données

Une parcelle est un objet. Le fichier `donnees/parcelles.json` contient un **tableau** de parcelles :

```js
{ id: 'P01', producteur: 'Awa Diallo', localite: 'Soubré', culture: 'cacao', surface: 3 }
```

`surface` est en hectares (ha).

## 1. `formaterParcelle(parcelle)` — facile

**Reçoit :** une parcelle. **Renvoie :** une chaîne de caractères.

```js
formaterParcelle({ id: 'P01', producteur: 'Awa Diallo', localite: 'Soubré', culture: 'cacao', surface: 3 })
// → 'P01 | Awa Diallo | Soubré | cacao | 3 ha'
```

<details><summary>Aide</summary>

1. Utilisez une chaîne avec des accents graves : `` `...` ``.
2. Insérez chaque propriété avec `${parcelle.id}`, etc.
3. Attention aux espaces autour de chaque `|`.
</details>

## 2. `trouverParcelle(parcelles, id)` — facile

**Reçoit :** le tableau des parcelles et un id comme `'P03'`. **Renvoie :** la parcelle trouvée, ou `undefined`.

<details><summary>Aide</summary>

1. On cherche **un seul** élément : c'est le travail de `find`.
2. `parcelles.find((parcelle) => ...)` : que doit-on comparer ?
3. `find` renvoie déjà `undefined` quand rien ne correspond.
</details>

## 3. `parcellesParCulture(parcelles, culture)` — facile

**Reçoit :** le tableau et une culture comme `'cacao'`. **Renvoie :** un **nouveau tableau** avec seulement les parcelles de cette culture (éventuellement vide).

<details><summary>Aide</summary>

1. On garde **plusieurs** éléments : c'est le travail de `filter`.
2. La condition compare `parcelle.culture` et `culture`.
</details>

## 4. `surfaceTotale(parcelles)` — moyen

**Reçoit :** un tableau de parcelles. **Renvoie :** la somme des surfaces. Tableau vide : `0`.

```js
surfaceTotale(parcelles) // avec les données fournies → 15.5
```

<details><summary>Aide</summary>

1. On transforme un tableau en **un seul nombre** : `reduce`.
2. `parcelles.reduce((total, parcelle) => total + ..., 0)`.
3. Pourquoi le `0` à la fin ? Testez sans lui avec un tableau vide.
</details>

## 5. `resumeParCulture(parcelles)` — plus difficile

**Reçoit :** un tableau de parcelles. **Renvoie :** un **objet**. Chaque clé est une culture ; sa valeur indique le nombre de parcelles et leur surface totale.

```js
resumeParCulture([
  { id: 'A1', culture: 'cacao', surface: 2, ... },
  { id: 'A2', culture: 'riz', surface: 1.5, ... },
  { id: 'A3', culture: 'cacao', surface: 0.5, ... },
])
// → { cacao: { nombre: 2, surface: 2.5 }, riz: { nombre: 1, surface: 1.5 } }
```

<details><summary>Aide</summary>

1. Commencez avec un objet vide : `const resume = {};`
2. Parcourez les parcelles avec `for (const parcelle of parcelles) { ... }`.
3. La clé dépend de la parcelle : on écrit `resume[parcelle.culture]` (crochets, pas de point).
4. Si `resume[parcelle.culture]` vaut `undefined`, créez d'abord `{ nombre: 0, surface: 0 }`.
5. Puis ajoutez 1 au nombre et la surface de la parcelle à la surface.
</details>

## Voir le résultat dans l'application

Quand le Membre 4 a fini `chargerDonnees` :

```powershell
node app.js parcelles
node app.js parcelles cacao
node app.js parcelle P03
```

Vous devez voir 8 parcelles et `surface totale : 15.5 ha`, puis 3 parcelles de cacao pour `6.5 ha`.

## Pour aller plus loin

- Ajoutez dans `test/parcelles.test.js` un test pour `resumeParCulture([])` : que doit-elle renvoyer ?
- Que se passe-t-il avec `node app.js parcelle p03` en minuscules ? Trouvez dans `app.js` la ligne qui le permet.

## Préparez votre présentation

- Quelle différence entre `find` et `filter` ? Que renvoie chacune quand rien ne correspond ?
- Pourquoi écrit-on `resume[parcelle.culture]` et pas `resume.parcelle.culture` ?
