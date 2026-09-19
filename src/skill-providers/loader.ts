/**
 * Skill Provider Loader
 *
 * Reads provider manifests (`*.json`) from three sources, highest priority first:
 *   1. `<cwd>/.omc/providers/`   — project-scoped overrides
 *   2. `~/.omc/providers/`       — user-scoped overrides
 *   3. `<package-root>/providers/` — builtin providers shipped with OMC (e.g. supabase)
 *
 * First manifest with a given `name` wins.
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { getSkillsDir } from '../features/builtin-skills/skills.js';
import type { SkillProviderManifest } from './types.js';

const BUILTIN_PROVIDERS_DIR = join(dirname(getSkillsDir()), 'providers');
const USER_PROVIDERS_DIR = join(homedir(), '.omc', 'providers');
const PROJECT_PROVIDERS_DIR = join(process.cwd(), '.omc', 'providers');

function readManifestsFromDir(dir: string): SkillProviderManifest[] {
  if (!existsSync(dir)) return [];
  const out: SkillProviderManifest[] = [];

  for (const entry of readdirSync(dir)) {
    if (!entry.endsWith('.json')) continue;
    const filePath = join(dir, entry);
    try {
      out.push(JSON.parse(readFileSync(filePath, 'utf-8')) as SkillProviderManifest);
    } catch {
      // Ignore malformed manifests; they must not break routing.
    }
  }

  return out;
}

export function loadProviderManifestsFromDir(dir: string): SkillProviderManifest[] {
  return readManifestsFromDir(dir);
}

export function loadProviderManifests(): SkillProviderManifest[] {
  const byName = new Map<string, SkillProviderManifest>();

  for (const manifest of [
    ...readManifestsFromDir(PROJECT_PROVIDERS_DIR),
    ...readManifestsFromDir(USER_PROVIDERS_DIR),
    ...readManifestsFromDir(BUILTIN_PROVIDERS_DIR),
  ]) {
    if (!byName.has(manifest.name)) byName.set(manifest.name, manifest);
  }

  return [...byName.values()];
}

export function getBuiltinProvidersDir(): string {
  return BUILTIN_PROVIDERS_DIR;
}
