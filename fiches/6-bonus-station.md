# Bonus — La station connectée

**Votre fichier :** `src/station.js` · **Vos tests :** `npm run test:station` (5 tests)

À faire **après** les 38 tests verts. Ce bonus est ouvert à toute l'équipe.

## L'idée

Dans un vrai champ, un capteur ne répond pas tout de suite : il faut attendre le réseau. Certains capteurs tombent en panne ou n'ont plus de batterie. Le fichier `donnees/capteurs.json` simule quatre capteurs :

```js
{ id: 'C-P01', parcelle: 'P01', delai: 800, enLigne: true, humidite: 54 }
{ id: 'C-P05', parcelle: 'P05', delai: 600, enLigne: false, humidite: null }
```

`delai` est le temps de réponse en millisecondes. `enLigne: false` veut dire que le capteur ne répond pas.

## 1. `interrogerCapteur(capteur)` — fabriquer une promesse

**Renvoie :** une **promesse** qui, après `capteur.delai` millisecondes :

- se **résout** avec `{ parcelle, humidite }` si le capteur est en ligne ;
- est **rejetée** avec ``new Error(`Capteur ${capteur.id} hors ligne`)`` sinon.

<details><summary>Aide</summary>

```js
return new Promise((resolve, reject) => {
  setTimeout(() => {
    // si le capteur est en ligne : resolve(...)
    // sinon : reject(...)
  }, capteur.delai);
});
```

</details>

## 2. `interrogerSansPlanter(capteur)` — attraper le rejet

Même travail, mais la promesse n'est **jamais rejetée**. En cas d'erreur, elle renvoie `{ parcelle, erreur }`, où `erreur` est le **message** de l'erreur.

<details><summary>Aide</summary>

`async`, puis `try { return await interrogerCapteur(capteur); } catch (erreur) { ... }`. Le `await` est indispensable ici : sans lui, le `catch` ne voit pas le rejet.
</details>

## 3. `releverUnParUn(capteurs)` et `releverEnParallele(capteurs)`

Les deux renvoient le même tableau de résultats, **dans l'ordre des capteurs**. La différence, c'est le temps d'attente :

- **Un par un** : une boucle `for...of` avec `await` à chaque tour. On attend chaque capteur avant de passer au suivant.
- **En parallèle** : on lance toutes les demandes avec `map`, puis `Promise.all` attend qu'elles soient toutes terminées.

## Voir le résultat

```powershell
node app.js station
```

```text
Interrogation de 4 capteurs, l'un après l'autre...
  terminé en 3604 ms
Interrogation des mêmes capteurs, en parallèle...
  terminé en 1201 ms
```

**Question à préparer pour la présentation :** pourquoi environ 3 600 ms dans un cas et 1 200 ms dans l'autre ? Retrouvez ces deux nombres à partir des délais de `capteurs.json`.

## Encore plus loin

- Remplacez `interrogerSansPlanter` par `Promise.allSettled` dans `releverEnParallele`. Comparez les résultats.
- Ajoutez une commande qui enregistre les mesures reçues dans `releves.json` avec `ajouterReleve` (Membre 4).
