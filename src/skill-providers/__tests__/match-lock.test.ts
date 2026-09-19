import { describe, test, expect } from 'vitest';
import { isBackendTask, matchProvider, getProviderSkills } from '../match.js';
import type { SkillProviderManifest } from '../types.js';
import { computeSha256, upsertSkillLockEntry, readSkillLock } from '../lock.js';

const supabaseManifest: SkillProviderManifest = {
  name: 'supabase',
  type: 'backend-skill-provider',
  skills: ['supabase', 'supabase-postgres-best-practices'],
  capabilities: { database: { schema_design: true, migration: true, rls: true } },
  activation: { keywords: ['supabase', 'postgres', 'database', 'schema', 'migration', 'rls'] },
  source: { repo: 'supabase/agent-skills', type: 'github' },
};

describe('isBackendTask', () => {
  test('detects backend/database terms', () => {
    expect(isBackendTask('add a supabase migration for teams')).toBe(true);
    expect(isBackendTask('design the postgres schema')).toBe(true);
    expect(isBackendTask('set up row level security policies')).toBe(true);
    expect(isBackendTask('build the database schema')).toBe(true);
  });

  test('does not match frontend/non-backend text', () => {
    expect(isBackendTask('add a login button to the React UI')).toBe(false);
    expect(isBackendTask('')).toBe(false);
  });
});

describe('matchProvider', () => {
  test('matches the supabase provider on activation keywords', () => {
    const match = matchProvider('create a supabase migration with rls', [supabaseManifest]);
    expect(match?.provider.name).toBe('supabase');
    expect(match?.matchedKeywords).toContain('supabase');
  });

  test('returns null when no keywords match', () => {
    expect(matchProvider('paint the bikeshed', [supabaseManifest])).toBeNull();
  });
});

describe('getProviderSkills', () => {
  test('resolves bundled skills for a known provider', () => {
    expect(getProviderSkills('supabase', [supabaseManifest])).toEqual([
      'supabase',
      'supabase-postgres-best-practices',
    ]);
  });

  test('returns an empty list for an unknown provider', () => {
    expect(getProviderSkills('unknown', [supabaseManifest])).toEqual([]);
  });
});

describe('skill lock', () => {
  test('computeSha256 is deterministic and content-sensitive', () => {
    expect(computeSha256('abc')).toBe(computeSha256('abc'));
    expect(computeSha256('abc')).not.toBe(computeSha256('abd'));
  });

  test('upsertSkillLockEntry records provenance', () => {
    const lock = upsertSkillLockEntry({ version: 1, skills: {} }, 'supabase', {
      source: 'supabase/agent-skills',
      sourceType: 'github',
      skillPath: 'skills/supabase/SKILL.md',
      computedHash: 'x',
    });
    expect(lock.skills.supabase.source).toBe('supabase/agent-skills');
  });

  test('readSkillLock returns an empty lock for a missing file', () => {
    const lock = readSkillLock('/nonexistent/skills-lock.json');
    expect(lock.skills).toEqual({});
  });
});
