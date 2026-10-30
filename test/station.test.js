// Tests du BONUS : ils peuvent rester rouges si l'équipe ne fait pas le bonus.
import test from 'node:test';
import assert from 'node:assert/strict';
import { interrogerCapteur, interrogerSansPlanter, releverEnParallele, releverUnParUn } from '../src/station.js';

const enLigne = { id: 'C1', parcelle: 'A1', delai: 20, enLigne: true, humidite: 48 };
const horsLigne = { id: 'C2', parcelle: 'A2', delai: 10, enLigne: false, humidite: null };

test('interrogerCapteur se résout avec la mesure du capteur', async () => {
  assert.deepEqual(await interrogerCapteur(enLigne), { parcelle: 'A1', humidite: 48 });
});

test('interrogerCapteur est rejetée si le capteur est hors ligne', async () => {
  await assert.rejects(interrogerCapteur(horsLigne), /C2 hors ligne/);
});

test('interrogerSansPlanter transforme l’erreur en résultat', async () => {
  assert.deepEqual(await interrogerSansPlanter(horsLigne), { parcelle: 'A2', erreur: 'Capteur C2 hors ligne' });
});

test('releverUnParUn et releverEnParallele renvoient les résultats dans l’ordre des capteurs', async () => {
  const attendu = [{ parcelle: 'A1', humidite: 48 }, { parcelle: 'A2', erreur: 'Capteur C2 hors ligne' }];
  assert.deepEqual(await releverUnParUn([enLigne, horsLigne]), attendu);
  assert.deepEqual(await releverEnParallele([enLigne, horsLigne]), attendu);
});

test('releverEnParallele attend moins longtemps que releverUnParUn', async () => {
  const capteurs = [1, 2, 3].map((n) => ({ id: `C${n}`, parcelle: `A${n}`, delai: 100, enLigne: true, humidite: 50 }));
  let debut = Date.now();
  await releverUnParUn(capteurs);
  const dureeUnParUn = Date.now() - debut;
  debut = Date.now();
  await releverEnParallele(capteurs);
  const dureeParallele = Date.now() - debut;
  assert.ok(dureeUnParUn >= 250, `un par un : ${dureeUnParUn} ms (attendu environ 300 ms)`);
  assert.ok(dureeParallele < 250, `en parallèle : ${dureeParallele} ms (attendu environ 100 ms)`);
});
