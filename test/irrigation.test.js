import test from 'node:test';
import assert from 'node:assert/strict';
import { alertesIrrigation, etatIrrigation, moyenneHumidite, relevesDeParcelle } from '../src/irrigation.js';

const cacao = { code: 'cacao', nom: 'Cacao', prixKg: 2000, humiditeMin: 40, humiditeMax: 70 };
const releves = [
  { parcelle: 'A1', date: '2026-10-26', humidite: 30, temperature: 30 },
  { parcelle: 'A2', date: '2026-10-26', humidite: 60, temperature: 28 },
  { parcelle: 'A1', date: '2026-10-27', humidite: 36, temperature: 31 },
];

test('relevesDeParcelle garde seulement les relevés de la parcelle', () => {
  assert.deepEqual(relevesDeParcelle(releves, 'A1'), [releves[0], releves[2]]);
  assert.deepEqual(relevesDeParcelle(releves, 'Z9'), []);
});

test('moyenneHumidite calcule la moyenne', () => {
  assert.equal(moyenneHumidite([releves[0], releves[2]]), 33);
});

test('moyenneHumidite arrondit à l’entier le plus proche', () => {
  const troisReleves = [{ humidite: 50 }, { humidite: 51 }, { humidite: 51 }];
  assert.equal(moyenneHumidite(troisReleves), 51);
});

test('moyenneHumidite renvoie null sans relevé', () => {
  assert.equal(moyenneHumidite([]), null);
});

test('etatIrrigation demande d’arroser si le sol est trop sec', () => {
  assert.equal(etatIrrigation(35, cacao), 'ARROSER');
});

test('etatIrrigation demande de drainer si le sol est trop humide', () => {
  assert.equal(etatIrrigation(80, cacao), 'DRAINER');
});

test('etatIrrigation répond OK entre les deux limites', () => {
  assert.equal(etatIrrigation(55, cacao), 'OK');
});

test('etatIrrigation répond INCONNU quand il n’y a pas de mesure', () => {
  assert.equal(etatIrrigation(null, cacao), 'INCONNU');
});

test('alertesIrrigation produit une alerte par parcelle', () => {
  const parcelles = [
    { id: 'A1', producteur: 'Ama', localite: 'Man', culture: 'cacao', surface: 2 },
    { id: 'A3', producteur: 'Nina', localite: 'Man', culture: 'cacao', surface: 1 },
  ];
  assert.deepEqual(alertesIrrigation(parcelles, releves, [cacao]), [
    { id: 'A1', producteur: 'Ama', culture: 'cacao', moyenne: 33, etat: 'ARROSER' },
    { id: 'A3', producteur: 'Nina', culture: 'cacao', moyenne: null, etat: 'INCONNU' },
  ]);
});
