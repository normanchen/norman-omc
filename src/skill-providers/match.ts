/**
 * Skill Provider Matching
 *
 * Detects backend tasks and matches them to a backend skill provider.
 * `isBackendTask` is consumed by the team role router; it derives its signal
 * from the loaded provider manifests (single source of truth) with a static
 * fallback so detection still works when no manifest is loadable.
 */

import type { SkillProviderManifest } from './types.js';
import { loadProviderManifests } from './loader.js';

/**
 * Fallback backend signal used when no provider manifest is available.
 * Broad enough to catch database/schema/migration work without frontend terms.
 */
const FALLBACK_BACKEND_DOMAIN_RE =
  /\b(?:supabase|postgres(?:ql)?|database|datastore|schema|migration|rls|row[ -]?level[ -]?security|sql|plpgsql|backend)\b/i;

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

let cachedProviders: SkillProviderManifest[] | null = null;
let cachedBackendRegex: RegExp | null = null;

function getProviders(): SkillProviderManifest[] {
  if (cachedProviders === null) {
    cachedProviders = loadProviderManifests();
  }
  return cachedProviders;
}

/** Build a word-boundary regex from every backend provider's activation keywords. */
function getBackendRegex(): RegExp {
  if (cachedBackendRegex) return cachedBackendRegex;

  const keywords = getProviders()
    .filter((p) => p.type === 'backend-skill-provider')
    .flatMap((p) => p.activation?.keywords ?? [])
    .filter((k): k is string => typeof k === 'string' && k.trim().length > 0);

  if (keywords.length === 0) return FALLBACK_BACKEND_DOMAIN_RE;

  const alternation = keywords
    .map((k) => escapeRegExp(k.trim()))
    .sort((a, b) => b.length - a.length)
    .join('|');
  cachedBackendRegex = new RegExp(`\\b(?:${alternation})\\b`, 'i');
  return cachedBackendRegex;
}

/** Return true when `text` describes a backend/database task. */
export function isBackendTask(text: string): boolean {
  if (!text || text.trim().length === 0) return false;
  return FALLBACK_BACKEND_DOMAIN_RE.test(text) || getBackendRegex().test(text);
}

export interface ProviderMatch {
  provider: SkillProviderManifest;
  matchedKeywords: string[];
  score: number;
}

/** Match a task against provider activation keywords (word-boundary, count-weighted). */
export function matchProvider(
  text: string,
  providers: SkillProviderManifest[],
): ProviderMatch | null {
  if (!text || providers.length === 0) return null;
  const lower = text.toLowerCase();
  let best: ProviderMatch | null = null;

  for (const provider of providers) {
    const keywords = provider.activation?.keywords ?? [];
    const matchedKeywords = keywords.filter((k) => {
      const kw = String(k).toLowerCase();
      return kw.length > 0 && new RegExp(`\\b${escapeRegExp(kw)}\\b`, 'i').test(lower);
    });
    if (matchedKeywords.length === 0) continue;

    // Prefer match count; total keyword length breaks ties.
    const score = matchedKeywords.length * 100 + matchedKeywords.reduce((n, k) => n + k.length, 0);
    if (!best || score > best.score) {
      best = { provider, matchedKeywords, score };
    }
  }

  return best;
}

/** Resolve the skill names a provider bundles. */
export function getProviderSkills(
  name: string,
  providers: SkillProviderManifest[],
): string[] {
  const provider = providers.find((p) => p.name === name);
  return provider?.skills ?? [];
}

export function isBackendProvider(provider: SkillProviderManifest): boolean {
  return provider.type === 'backend-skill-provider';
}
