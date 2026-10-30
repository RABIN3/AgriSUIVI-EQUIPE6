// AgriSuivi — point d'entrée. Ce fichier est fourni : lisez-le, mais
// le travail de l'équipe se fait dans le dossier src.
import { join } from 'node:path';
import { ajouterReleve, chargerDonnees, creerReleve, lireJson } from './src/donnees.js';
import { formaterParcelle, parcellesParCulture, resumeParCulture, surfaceTotale, trouverParcelle } from './src/parcelles.js';
import { alertesIrrigation } from './src/irrigation.js';
import { bilanRecoltes, classerParRevenu } from './src/recoltes.js';
import { construireRapport, enregistrerRapport } from './src/rapport.js';
import { releverEnParallele, releverUnParUn } from './src/station.js';

const DOSSIER_DONNEES = './donnees';
const commande = process.argv[2] ?? 'aide';
const options = process.argv.slice(3);

function aujourdhui() {
  return new Date().toISOString().slice(0, 10);
}

function afficherAide() {
  console.log(`AgriSuivi — tableau de bord de la coopérative Terre d'Avenir

Commandes :
  node app.js parcelles            Lister les parcelles et la surface totale
  node app.js parcelles cacao      Lister seulement les parcelles d'une culture
  node app.js parcelle P03         Afficher la fiche complète d'une parcelle
  node app.js irrigation           Savoir quelles parcelles arroser ou drainer
  node app.js recoltes             Classer les parcelles par revenu estimé
  node app.js releve P07 64 29     Ajouter un relevé (parcelle, humidité %, température °C)
  node app.js rapport              Écrire le rapport du jour dans le dossier sorties
  node app.js station              Bonus : interroger les capteurs connectés`);
}

async function afficherParcelles(culture) {
  const { parcelles } = await chargerDonnees(DOSSIER_DONNEES);
  const liste = culture ? parcellesParCulture(parcelles, culture) : parcelles;
  for (const parcelle of liste) {
    console.log(formaterParcelle(parcelle));
  }
  console.log(`\n${liste.length} parcelle(s) — surface totale : ${surfaceTotale(liste)} ha\n`);
  console.table(resumeParCulture(liste));
}

async function afficherFicheParcelle(id) {
  if (!id) {
    throw new Error('Indiquez une parcelle. Exemple : node app.js parcelle P03');
  }
  const { parcelles, cultures, releves, recoltes } = await chargerDonnees(DOSSIER_DONNEES);
  const parcelle = trouverParcelle(parcelles, id.toUpperCase());
  if (parcelle === undefined) {
    throw new Error(`Parcelle ${id} introuvable`);
  }
  const [alerte] = alertesIrrigation([parcelle], releves, cultures);
  const [bilan] = bilanRecoltes([parcelle], recoltes, cultures);
  console.log(`Parcelle ${parcelle.id} — ${parcelle.producteur} (${parcelle.localite})`);
  console.log(`Culture : ${parcelle.culture} sur ${parcelle.surface} ha`);
  console.log(`Humidité moyenne : ${alerte.moyenne ?? '?'} % → ${alerte.etat}`);
  console.log(`Récolte : ${bilan.kg} kg (${bilan.rendement} kg/ha)`);
  console.log(`Revenu estimé : ${bilan.revenu} FCFA`);
}

async function afficherIrrigation() {
  const { parcelles, cultures, releves } = await chargerDonnees(DOSSIER_DONNEES);
  console.table(alertesIrrigation(parcelles, releves, cultures));
}

async function afficherRecoltes() {
  const { parcelles, cultures, recoltes } = await chargerDonnees(DOSSIER_DONNEES);
  console.table(classerParRevenu(bilanRecoltes(parcelles, recoltes, cultures)));
}

async function enregistrerReleve(id, humidite, temperature) {
  const releve = creerReleve(id, humidite, temperature, aujourdhui());
  const { parcelles } = await chargerDonnees(DOSSIER_DONNEES);
  if (trouverParcelle(parcelles, releve.parcelle) === undefined) {
    throw new Error(`Parcelle ${releve.parcelle} introuvable`);
  }
  const nombre = await ajouterReleve(join(DOSSIER_DONNEES, 'releves.json'), releve);
  console.log(`Relevé ajouté pour ${releve.parcelle} : ${releve.humidite} % d'humidité, ${releve.temperature} °C.`);
  console.log(`Le fichier contient maintenant ${nombre} relevés.`);
}

async function produireRapport() {
  const date = aujourdhui();
  const donnees = await chargerDonnees(DOSSIER_DONNEES);
  const texte = construireRapport(donnees, date);
  const chemin = join('sorties', `rapport-${date}.txt`);
  await enregistrerRapport(chemin, texte);
  console.log(texte);
  console.log(`Rapport enregistré dans ${chemin}`);
}

async function interrogerStation() {
  const capteurs = await lireJson(join(DOSSIER_DONNEES, 'capteurs.json'));

  console.log(`Interrogation de ${capteurs.length} capteurs, l'un après l'autre...`);
  let debut = Date.now();
  await releverUnParUn(capteurs);
  console.log(`  terminé en ${Date.now() - debut} ms`);

  console.log('Interrogation des mêmes capteurs, en parallèle...');
  debut = Date.now();
  const resultats = await releverEnParallele(capteurs);
  console.log(`  terminé en ${Date.now() - debut} ms\n`);
  console.table(resultats);
}

async function main() {
  try {
    switch (commande) {
      case 'parcelles':
        await afficherParcelles(options[0]);
        break;
      case 'parcelle':
        await afficherFicheParcelle(options[0]);
        break;
      case 'irrigation':
        await afficherIrrigation();
        break;
      case 'recoltes':
        await afficherRecoltes();
        break;
      case 'releve':
        await enregistrerReleve(options[0], options[1], options[2]);
        break;
      case 'rapport':
        await produireRapport();
        break;
      case 'station':
        await interrogerStation();
        break;
      case 'aide':
        afficherAide();
        break;
      default:
        console.log(`Commande inconnue : ${commande}\n`);
        afficherAide();
        process.exitCode = 1;
    }
  } catch (erreur) {
    console.error(`Erreur : ${erreur.message}`);
    if (erreur.cause) {
      console.error(`Cause : ${erreur.cause.message}`);
    }
    process.exitCode = 1;
  }
}

main();
