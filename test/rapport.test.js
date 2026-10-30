import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { construireRapport, enregistrerRapport, listerParEtat } from '../src/rapport.js';

const donnees = {
  cultures: [
    { code: 'cacao', nom: 'Cacao', prixKg: 2000, humiditeMin: 40, humiditeMax: 70 },
    { code: 'riz', nom: 'Riz', prixKg: 300, humiditeMin: 60, humiditeMax: 90 },
  ],
  parcelles: [
    { id: 'A1', producteur: 'Ama', localite: 'Man', culture: 'cacao', surface: 2 },
    { id: 'A2', producteur: 'Moussa', localite: 'Odienné', culture: 'riz', surface: 1.5 },
    { id: 'A3', producteur: 'Nina', localite: 'Man', culture: 'cacao', surface: 0.5 },
  ],
  releves: [
    { parcelle: 'A1', date: '2026-10-26', humidite: 30, temperature: 30 },
    { parcelle: 'A2', date: '2026-10-26', humidite: 75, temperature: 28 },
  ],
  recoltes: [
    { parcelle: 'A1', date: '2026-09-01', kg: 800 },
    { parcelle: 'A2', date: '2026-09-15', kg: 3000 },
    { parcelle: 'A3', date: '2026-10-01', kg: 200 },
  ],
};

test('listerParEtat liste les id ou répond aucune', () => {
  const alertes = [{ id: 'A1', etat: 'ARROSER' }, { id: 'A2', etat: 'OK' }, { id: 'A3', etat: 'ARROSER' }];
  assert.equal(listerParEtat(alertes, 'ARROSER'), 'A1, A3');
  assert.equal(listerParEtat(alertes, 'DRAINER'), 'aucune');
});

test('construireRapport produit exactement le texte attendu', () => {
  const attendu = [
    '=== RAPPORT AGRISUIVI DU 2026-10-29 ===',
    'Parcelles suivies : 3',
    'Surface totale : 4 ha',
    '',
    '--- Irrigation ---',
    'À arroser : A1',
    'À drainer : aucune',
    'Sans relevé : A3',
    '',
    '--- Récoltes ---',
    'Production totale : 4000 kg',
    'Revenu estimé : 2900000 FCFA',
    'Meilleure parcelle : A1 (Ama) avec 1600000 FCFA',
    '',
  ].join('\n');
  assert.equal(construireRapport(donnees, '2026-10-29'), attendu);
});

test('enregistrerRapport crée le dossier puis écrit le fichier', async () => {
  const dossier = join('test', 'tmp', 'sorties-essai');
  await rm(dossier, { recursive: true, force: true });
  const chemin = join(dossier, 'rapport.txt');
  await enregistrerRapport(chemin, 'Bonjour la coopérative\n');
  assert.equal(await readFile(chemin, 'utf8'), 'Bonjour la coopérative\n');
});
