/**
 * Skill Providers Module
 *
 * Norman-OMC's "Skill Federation Layer": a lightweight registry for external
 * engineering skill providers (Supabase is the first). See `types.ts` for the
 * manifest schema, `loader.ts` for discovery, `match.ts` for task matching,
 * and `lock.ts` for provenance pinning.
 */

export * from './types.js';
export * from './match.js';
export * from './loader.js';
export * from './lock.js';
