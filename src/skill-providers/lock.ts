/**
 * Skill Lock — external skill provenance/version pinning (reference, not copy).
 *
 * Mirrors the existing `skills-lock.json` schema (`source` / `sourceType` /
 * `skillPath` / `computedHash`) and is the reader/writer for it. This is how
 * Norman-OMC records that a provider's skills come from an upstream repo
 * (e.g. `supabase/agent-skills`) instead of vendoring them.
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';

export interface SkillLockEntry {
  source: string;
  sourceType: string;
  skillPath: string;
  computedHash: string;
}

export interface SkillLock {
  version: number;
  skills: Record<string, SkillLockEntry>;
}

export function readSkillLock(path = 'skills-lock.json'): SkillLock {
  if (!existsSync(path)) return { version: 1, skills: {} };
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf-8')) as Partial<SkillLock>;
    return { version: parsed.version ?? 1, skills: parsed.skills ?? {} };
  } catch {
    return { version: 1, skills: {} };
  }
}

export function writeSkillLock(lock: SkillLock, path = 'skills-lock.json'): void {
  writeFileSync(path, `${JSON.stringify(lock, null, 2)}\n`);
}

export function computeSha256(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

export function upsertSkillLockEntry(
  lock: SkillLock,
  name: string,
  entry: SkillLockEntry,
): SkillLock {
  lock.skills[name] = entry;
  return lock;
}
