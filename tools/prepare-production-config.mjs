import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { mergeProductionConfig, parseYamlStrict, validateRuntimeConfig } from './secure-config.mjs';

const root = process.cwd();
const basePath = path.join(root, '_config.yml');
const productionPath = path.join(root, '_config.production.yml');

const base = parseYamlStrict(await fs.readFile(basePath, 'utf8'), '_config.yml');
const production = parseYamlStrict(await fs.readFile(productionPath, 'utf8'), '_config.production.yml');
const merged = mergeProductionConfig(base, production);
const expectedCommit = process.env.GITHUB_SHA || process.env.LLSG_EXPECTED_RELEASE_COMMIT || '';
const failures = validateRuntimeConfig(merged, { production: true, expectedCommit });
if (failures.length) throw new Error(`Produktionskonfiguration wurde nicht vollständig freigegeben: ${failures.join('; ')}`);
const serialized = `# Generated in CI from the reviewed base and production overlays.\n${YAML.stringify(merged)}`;
const roundTrip = parseYamlStrict(serialized, 'generierte Produktionskonfiguration');
const roundTripFailures = validateRuntimeConfig(roundTrip, { production: true, expectedCommit });
if (roundTripFailures.length) throw new Error(`Serialisierte Produktionskonfiguration ist ungültig: ${roundTripFailures.join('; ')}`);
await fs.writeFile(basePath, serialized);
console.log('Produktionskonfiguration wurde für den unveränderlichen CI-Build zusammengeführt.');
