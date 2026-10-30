import test from 'node:test';
import assert from 'node:assert/strict';
import { bilanRecoltes, classerParRevenu, rendement, revenu, totalRecolte } from '../src/recoltes.js';

const cultures = [
  { code: 'cacao', nom: 'Cacao', prixKg: 2000, humiditeMin: 40, humiditeMax: 70 },
  { code: 'manioc', nom: 'Manioc', prixKg: 100, humiditeMin: 30, humiditeMax: 60 },
];
const parcelles = [
  { id: 'A1', producteur: 'Ama', localite: 'Man', culture: 'manioc', surface: 2 },
  { id: 'A2', producteur: 'Moussa', localite: 'Odienné', culture: 'cacao', surface: 1.5 },
];
const recoltes = [
  { parcelle: 'A1', date: '2026-09-01', kg: 5000 },
  { parcelle: 'A2', date: '2026-09-15', kg: 400 },
  { parcelle: 'A1', date: '2026-10-01', kg: 3000 },
];

test('totalRecolte additionne les kilos d’une parcelle', () => {
  assert.equal(totalRecolte(recoltes, 'A1'), 8000);
});

test('totalRecolte vaut 0 pour une parcelle sans récolte', () => {
  assert.equal(totalRecolte(recoltes, 'Z9'), 0);
});

test('rendement divise les kilos par la surface et arrondit', () => {
  assert.equal(rendement(8000, 2), 4000);
  assert.equal(rendement(400, 1.5), 267);
});

test('rendement refuse une surface nulle', () => {
  assert.throws(() => rendement(100, 0), RangeError);
});

test('revenu multiplie les kilos par le prix', () => {
  assert.equal(revenu(400, 2000), 800000);
});

test('bilanRecoltes produit une ligne par parcelle', () => {
  assert.deepEqual(bilanRecoltes(parcelles, recoltes, cultures), [
    { id: 'A1', producteur: 'Ama', culture: 'manioc', kg: 8000, rendement: 4000, revenu: 800000 },
    { id: 'A2', producteur: 'Moussa', culture: 'cacao', kg: 400, rendement: 267, revenu: 800000 },
  ]);
});

test('classerParRevenu trie du plus grand revenu au plus petit', () => {
  const bilan = [{ id: 'A1', revenu: 100 }, { id: 'A2', revenu: 900 }, { id: 'A3', revenu: 500 }];
  assert.deepEqual(classerParRevenu(bilan).map((ligne) => ligne.id), ['A2', 'A3', 'A1']);
});

test('classerParRevenu ne modifie pas le tableau reçu', () => {
  const bilan = [{ id: 'A1', revenu: 100 }, { id: 'A2', revenu: 900 }];
  classerParRevenu(bilan);
  assert.deepEqual(bilan.map((ligne) => ligne.id), ['A1', 'A2']);
});
