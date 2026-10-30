import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ajouterReleve, chargerDonnees, creerReleve, lireJson } from '../src/donnees.js';

const FIXTURES = join('test', 'fixtures');
const TMP = join('test', 'tmp');

test('lireJson lit un fichier et renvoie un tableau', async () => {
  const parcelles = await lireJson(join(FIXTURES, 'parcelles.json'));
  assert.equal(parcelles.length, 2);
  assert.equal(parcelles[0].id, 'A1');
});

test('lireJson rejette avec un message utile si le fichier est absent', async () => {
  await assert.rejects(lireJson(join(FIXTURES, 'absent.json')), (erreur) => {
    assert.match(erreur.message, /Impossible de lire/);
    assert.match(erreur.message, /absent\.json/);
    assert.ok(erreur.cause, 'l’erreur d’origine doit être gardée dans cause');
    return true;
  });
});

test('lireJson rejette aussi si le JSON est mal écrit', async () => {
  await assert.rejects(lireJson(join(FIXTURES, 'casse.json')), /Impossible de lire/);
});

test('chargerDonnees renvoie les quatre listes', async () => {
  const donnees = await chargerDonnees(FIXTURES);
  assert.deepEqual(Object.keys(donnees).sort(), ['cultures', 'parcelles', 'recoltes', 'releves']);
  assert.equal(donnees.parcelles.length, 2);
  assert.equal(donnees.cultures.length, 1);
  assert.equal(donnees.releves.length, 3);
  assert.equal(donnees.recoltes.length, 2);
});

test('creerReleve convertit les textes du terminal', () => {
  assert.deepEqual(creerReleve('p07', '64', '29', '2026-10-29'), {
    parcelle: 'P07',
    date: '2026-10-29',
    humidite: 64,
    temperature: 29,
  });
});

test('creerReleve refuse une parcelle absente avec un message qui parle de la parcelle', () => {
  assert.throws(() => creerReleve(undefined, '64', '29', '2026-10-29'), /parcelle/i);
  assert.throws(() => creerReleve('', '64', '29', '2026-10-29'), /parcelle/i);
});

test('creerReleve refuse une humidité qui n’est pas un nombre', () => {
  assert.throws(() => creerReleve('P07', 'beaucoup', '29', '2026-10-29'), /humidit/i);
});

test('creerReleve refuse une humidité hors de 0 à 100', () => {
  assert.throws(() => creerReleve('P07', '120', '29', '2026-10-29'), /humidit/i);
  assert.throws(() => creerReleve('P07', '-5', '29', '2026-10-29'), /humidit/i);
});

test('creerReleve refuse une température qui n’est pas un nombre', () => {
  assert.throws(() => creerReleve('P07', '64', 'chaud', '2026-10-29'), /temp/i);
});

test('ajouterReleve ajoute à la fin du fichier et renvoie le nombre de relevés', async () => {
  await mkdir(TMP, { recursive: true });
  const chemin = join(TMP, 'releves.json');
  await writeFile(chemin, JSON.stringify([{ parcelle: 'A1', date: '2026-10-26', humidite: 40, temperature: 30 }]), 'utf8');

  const nouveau = { parcelle: 'A2', date: '2026-10-29', humidite: 55, temperature: 28 };
  assert.equal(await ajouterReleve(chemin, nouveau), 2);

  const contenu = JSON.parse(await readFile(chemin, 'utf8'));
  assert.equal(contenu.length, 2);
  assert.deepEqual(contenu[1], nouveau);
});
