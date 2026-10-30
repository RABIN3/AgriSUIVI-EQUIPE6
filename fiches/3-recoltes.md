# Membre 3 — Récoltes

**Votre fichier :** `src/recoltes.js` · **Vos tests :** `npm run test:recoltes` (8 tests)

Vous répondez aux questions : *combien de kilos par parcelle ? quel rendement ? combien cela peut-il rapporter ?*

## Les données

Une récolte (`donnees/recoltes.json`) ; une parcelle peut avoir plusieurs récoltes, ou aucune :

```js
{ parcelle: 'P01', date: '2026-09-15', kg: 900 }
```

Le prix au kilo est dans la culture (`donnees/cultures.json`) : `prixKg`, en FCFA. Les prix sont fictifs.

## 1. `totalRecolte(recoltes, idParcelle)` — moyen

**Reçoit :** toutes les récoltes et un id. **Renvoie :** le total des `kg` de cette parcelle. Aucune récolte : `0`.

```js
totalRecolte(recoltes, 'P01') // avec les données fournies → 1650  (900 + 750)
```

<details><summary>Aide</summary>

1. Gardez les récoltes de la parcelle avec `filter`.
2. Additionnez leurs `kg` avec `reduce(..., 0)`.
3. On peut enchaîner : `recoltes.filter(...).reduce(...)`.
</details>

## 2. `rendement(kg, surface)` — facile

**Reçoit :** des kilos et une surface en hectares. **Renvoie :** les kilos par hectare, **arrondis à l'entier le plus proche**.

```js
rendement(8000, 2)  // → 4000
rendement(400, 1.5) // → 267   (266,67 arrondi)
rendement(100, 0)   // → lance une RangeError
```

Si `surface` est inférieure ou égale à 0, lancez une erreur : `throw new RangeError('La surface doit être supérieure à 0');`

<details><summary>Aide</summary>

1. Vérifiez d'abord la surface avec un `if`.
2. Puis `return Math.round(kg / surface);`
</details>

## 3. `revenu(kg, prixKg)` — facile

**Renvoie :** le revenu estimé en FCFA. `revenu(400, 2000)` → `800000`.

## 4. `bilanRecoltes(parcelles, recoltes, cultures)` — plus difficile

**Renvoie :** un tableau avec **une ligne par parcelle**, dans le même ordre que `parcelles` :

```js
{ id: 'P01', producteur: 'Awa Diallo', culture: 'cacao', kg: 1650, rendement: 550, revenu: 3300000 }
```

<details><summary>Aide</summary>

1. Une ligne par parcelle : `parcelles.map((parcelle) => { ... })`.
2. Retrouvez la culture avec `cultures.find(...)` pour connaître `prixKg`.
3. Réutilisez vos trois fonctions : `totalRecolte`, `rendement`, `revenu`.
4. N'oubliez pas le `return` de l'objet.
</details>

## 5. `classerParRevenu(bilan)` — moyen

**Renvoie :** une **copie** du bilan, triée du plus grand revenu au plus petit. Le tableau reçu ne doit **pas** changer.

<details><summary>Aide</summary>

1. `sort` modifie le tableau sur lequel on l'appelle. Copiez d'abord : `[...bilan]`.
2. `sort((a, b) => b.revenu - a.revenu)` : du plus grand au plus petit.
3. Essayez `a.revenu - b.revenu` pour voir la différence.
</details>

## Voir le résultat dans l'application

```powershell
node app.js recoltes
```

Attendu : P01 en tête avec `3300000` FCFA, P04 en dernier avec `0` (pas encore récoltée).

## Pour aller plus loin

- Ajoutez un test : `rendement(100, -2)` doit aussi lancer une `RangeError`.
- Ajoutez une fonction `classerParRendement(bilan)` et son test.

## Préparez votre présentation

- Pourquoi copier le tableau avant de le trier ? Montrez ce qui se passe sans la copie.
- Que fait `rendement` quand la surface vaut 0, et pourquoi ne pas simplement renvoyer `0` ?
