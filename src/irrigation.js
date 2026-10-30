// MEMBRE 2 — Irrigation : lire les relevés des capteurs et décider quoi faire.
// Fiche : fiches/2-irrigation.md · Vérifier : npm run test:irrigation

// Renvoie seulement les relevés de la parcelle demandée.
export function relevesDeParcelle(releves, idParcelle) {
  return releves.filter((r) => r.parcelle === idParcelle);
}

// Renvoie la moyenne des humidités, arrondie à l'entier le plus proche.
// Liste vide : null (on ne peut pas calculer de moyenne).
export function moyenneHumidite(releves) {
{  if (releves.length === 0) return null;
  const total = releves.reduce((somme,r) => somme +r.humidite,0);
  return Math.round(total/releves.length);
}

}

// Renvoie 'INCONNU', 'ARROSER', 'DRAINER' ou 'OK'.
// Les bornes humiditeMin et humiditeMax font partie de la zone 'OK'.
export function etatIrrigation(humidite, culture) {
 if ( humidite === null ) return "INCONNU";
 if ( humidite < culture.humiditeMin ) return "ARROSER";
  if ( humidite > culture.humiditeMax ) return "DRAINER";
  return "OK";
}


// Renvoie un tableau d'alertes, une par parcelle, dans le même ordre que parcelles.
// Chaque alerte : { id, producteur, culture, moyenne, etat }
export function alertesIrrigation(parcelles, releves, cultures) {
  return parcelles.map(( parcelle) => {
    const mesReleves = relevesDeParcelle( releves,parcelle.id);
const moyenne = moyenneHumidite(mesReleves);
const culture = cultures.find((c) => c.code === parcelle.culture);
const etat = etatIrrigation(moyenne,culture);
return {
  id : parcelle.id,
producteur : parcelle.producteur,
culture : parcelle.culture,
moyenne : moyenne,
etat : etat,
};
 });
}
