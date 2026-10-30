// MEMBRE 3 — Récoltes : calculer la production, le rendement et le revenu.
// Fiche : fiches/3-recoltes.md · Vérifier : npm run test:recoltes

// Renvoie le total des kilos récoltés sur une parcelle. Aucune récolte : 0.
export function totalRecolte(recoltes, idParcelle) {
  throw new Error("TODO Membre 3 : coder totalRecolte dans src/recoltes.js");
}

// Renvoie le rendement en kg par hectare, arrondi à l'entier le plus proche.
// Une surface nulle ou négative est une erreur : on lance une RangeError.
export function rendement(kg, surface) {
  throw new Error("TODO Membre 3 : coder rendement dans src/recoltes.js");
}

// Renvoie le revenu estimé en FCFA.
export function revenu(kg, prixKg) {
  throw new Error("TODO Membre 3 : coder revenu dans src/recoltes.js");
}

// Renvoie une ligne de bilan par parcelle, dans le même ordre que parcelles.
// Chaque ligne : { id, producteur, culture, kg, rendement, revenu }
export function bilanRecoltes(parcelles, recoltes, cultures) {
  throw new Error("TODO Membre 3 : coder bilanRecoltes dans src/recoltes.js");
}

// Renvoie une COPIE du bilan, triée du plus grand revenu au plus petit.
// Le tableau reçu ne doit pas changer d'ordre.
export function classerParRevenu(bilan) {
  throw new Error(
    "TODO Membre 3 : coder classerParRevenu dans src/recoltes.js",
  );
}
