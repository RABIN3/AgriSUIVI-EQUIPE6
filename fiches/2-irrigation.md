# Membre 2 — Irrigation

**Votre fichier :** `src/irrigation.js` · **Vos tests :** `npm run test:irrigation` (9 tests)

Des capteurs mesurent l'**humidité du sol** (en %) de chaque parcelle. Vous répondez à la question : *faut-il arroser, drainer, ou tout va bien ?*

## Les données

Un relevé de capteur (`donnees/releves.json`) :

```js
{ parcelle: 'P01', date: '2026-10-26', humidite: 55, temperature: 28 }
```

Une culture (`donnees/cultures.json`) indique la zone d'humidité idéale :

```js
{ code: 'cacao', nom: 'Cacao', prixKg: 2000, humiditeMin: 40, humiditeMax: 70 }
```

## 1. `relevesDeParcelle(releves, idParcelle)` — facile

**Reçoit :** tous les relevés et un id de parcelle. **Renvoie :** un nouveau tableau avec seulement les relevés de cette parcelle.

<details><summary>Aide</summary>

`filter`, en comparant `releve.parcelle` et `idParcelle`.
</details>

## 2. `moyenneHumidite(releves)` — moyen

**Reçoit :** un tableau de relevés. **Renvoie :** la moyenne des `humidite`, **arrondie à l'entier le plus proche**. Si le tableau est vide : `null`.

```js
moyenneHumidite([{ humidite: 30 }, { humidite: 36 }])                   // → 33
moyenneHumidite([{ humidite: 50 }, { humidite: 51 }, { humidite: 51 }]) // → 51  (50,67 arrondi)
moyenneHumidite([])                                                     // → null
```

<details><summary>Aide</summary>

1. Traitez d'abord le cas vide : `if (releves.length === 0) { return null; }`.
2. Faites la somme des humidités avec `reduce` (ou une boucle `for...of`).
3. Moyenne = somme ÷ nombre de relevés.
4. `Math.round(...)` arrondit à l'entier le plus proche.
</details>

## 3. `etatIrrigation(humidite, culture)` — moyen

**Reçoit :** une humidité (nombre ou `null`) et un objet culture. **Renvoie :** un de ces quatre textes :

| Situation | Réponse |
|---|---|
| `humidite` vaut `null` (pas de mesure) | `'INCONNU'` |
| `humidite` est **inférieure** à `culture.humiditeMin` | `'ARROSER'` |
| `humidite` est **supérieure** à `culture.humiditeMax` | `'DRAINER'` |
| sinon (les limites comprises) | `'OK'` |

Pour le cacao (40 à 70) : 35 → `'ARROSER'`, 40 → `'OK'`, 70 → `'OK'`, 71 → `'DRAINER'`.

<details><summary>Aide</summary>

1. Une suite de `if` qui font chacun un `return`.
2. Vérifiez `null` **en premier**.
3. Utilisez `<` et `>`, pas `<=` ni `>=` : les limites doivent donner `'OK'`.
</details>

## 4. `alertesIrrigation(parcelles, releves, cultures)` — plus difficile

**Reçoit :** les trois tableaux. **Renvoie :** un tableau avec **une alerte par parcelle**, dans le même ordre :

```js
{ id: 'P02', producteur: 'Akissi Brou', culture: 'cacao', moyenne: 35, etat: 'ARROSER' }
```

<details><summary>Aide</summary>

1. Un objet par parcelle : c'est le travail de `map`.
2. Pour chaque parcelle, retrouvez sa culture : `cultures.find((element) => element.code === parcelle.culture)`.
3. Réutilisez vos fonctions : `moyenneHumidite(relevesDeParcelle(releves, parcelle.id))`.
4. Puis `etatIrrigation(moyenne, culture)`.
5. Dans `map`, si vous ouvrez des accolades `{`, n'oubliez pas le `return`.
</details>

## Voir le résultat dans l'application

```powershell
node app.js irrigation
```

Attendu : P02 et P04 `ARROSER`, P05 et P08 `DRAINER`, P07 `INCONNU`, les autres `OK`.

## Pour aller plus loin

- Ajoutez des tests pour les limites exactes : 40 et 70 pour le cacao doivent donner `'OK'`.
- Ajoutez un relevé avec `node app.js releve P07 64 29`, puis relancez `node app.js irrigation`. Que devient P07 ? (Pour annuler : `git restore donnees/releves.json`.)

## Préparez votre présentation

- Pourquoi `moyenneHumidite([])` renvoie-t-elle `null` et pas `0` ? Que se passerait-il avec `0` ?
- Pourquoi l'ordre des `if` compte-t-il dans `etatIrrigation` ?
