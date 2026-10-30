import test from 'node:test';
import assert from 'node:assert/strict';
import { formaterParcelle, parcellesParCulture, resumeParCulture, surfaceTotale, trouverParcelle } from '../src/parcelles.js';

const parcelles = [
  { id: 'A1', producteur: 'Ama', localite: 'Man', culture: 'cacao', surface: 2 },
  { id: 'A2', producteur: 'Moussa', localite: 'Odienné', culture: 'riz', surface: 1.5 },
  { id: 'A3', producteur: 'Nina', localite: 'Man', culture: 'cacao', surface: 0.5 },
];

test('formaterParcelle écrit les informations sur une ligne', () => {
  assert.equal(formaterParcelle(parcelles[0]), 'A1 | Ama | Man | cacao | 2 ha');
  assert.equal(formaterParcelle(parcelles[1]), 'A2 | Moussa | Odienné | riz | 1.5 ha');
});

test('trouverParcelle renvoie la parcelle demandée', () => {
  assert.equal(trouverParcelle(parcelles, 'A2'), parcelles[1]);
});

test('trouverParcelle renvoie undefined si la parcelle n’existe pas', () => {
  assert.equal(trouverParcelle(parcelles, 'Z9'), undefined);
});

test('parcellesParCulture garde seulement la culture demandée', () => {
  const resultat = parcellesParCulture(parcelles, 'cacao');
  assert.deepEqual(resultat.map((parcelle) => parcelle.id), ['A1', 'A3']);
});

test('parcellesParCulture renvoie une liste vide si aucune parcelle ne correspond', () => {
  assert.deepEqual(parcellesParCulture(parcelles, 'tomate'), []);
});

test('surfaceTotale additionne les surfaces', () => {
  assert.equal(surfaceTotale(parcelles), 4);
});

test('surfaceTotale d’une liste vide vaut 0', () => {
  assert.equal(surfaceTotale([]), 0);
});

test('resumeParCulture compte les parcelles et additionne les surfaces', () => {
  assert.deepEqual(resumeParCulture(parcelles), {
    cacao: { nombre: 2, surface: 2.5 },
    riz: { nombre: 1, surface: 1.5 },
  });
});
