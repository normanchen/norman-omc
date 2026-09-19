/**
 * Skill Provider Types
 *
 * A "skill provider" is an external engineering-capability bundle (e.g. Supabase)
 * that ships Agent Skills (`SKILL.md` + `references/`). Norman-OMC references these
 * skills rather than copying them (see the `skill.lock` reference mechanism), and
 * routes backend work to a dedicated agent that loads the provider's skills.
 *
 * Providers are described by a manifest: builtin manifests ship under
 * `providers/*.json`; users/projects may override them via
 * `~/.omc/providers/` and `<project>/.omc/providers/`.
 */

export type SkillProviderType = 'backend-skill-provider';

export interface DatabaseCapability {
  schema_design?: boolean;
  migration?: boolean;
  rls?: boolean;
}

export interface EnabledCapability {
  enabled?: boolean;
}

export interface ProviderCapabilities {
  database?: DatabaseCapability;
  auth?: EnabledCapability;
  storage?: EnabledCapability;
  functions?: EnabledCapability;
  realtime?: EnabledCapability;
  vectors?: EnabledCapability;
  [key: string]: unknown;
}

export interface SkillProviderSource {
  repo: string;
  type: 'github';
}

export interface SkillProviderActivation {
  keywords: string[];
}

export interface SkillProviderManifest {
  /** Unique provider identifier (e.g. "supabase"). */
  name: string;
  type: SkillProviderType;
  /** Skill names this provider bundles (resolved against installed skills). */
  skills: string[];
  capabilities: ProviderCapabilities;
  activation: SkillProviderActivation;
  source: SkillProviderSource;
}
