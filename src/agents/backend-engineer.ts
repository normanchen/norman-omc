/**
 * Backend Engineer Agent
 *
 * Domain specialist for backend/database work (Supabase/Postgres by default).
 * Routes from backend-domain tasks; loads the active backend skill provider's
 * skills (see `src/skill-providers/`) before implementing.
 */

import type { AgentConfig, AgentPromptMetadata } from './types.js';
import { loadAgentPrompt } from './utils.js';

export const BACKEND_ENGINEER_PROMPT_METADATA: AgentPromptMetadata = {
  category: 'specialist',
  cost: 'EXPENSIVE',
  promptAlias: 'backend-engineer',
  triggers: [
    {
      domain: 'Backend/Database',
      trigger: 'Supabase/Postgres schema, migrations, RLS, auth, storage, edge functions',
    },
  ],
  useWhen: [
    'Designing database schemas or migrations',
    'Implementing RLS policies, auth, storage, or API endpoints',
    'Building backend/database features (Supabase/Postgres by default)',
  ],
  avoidWhen: [
    'Frontend/UI work',
  ],
};

export const backendEngineerAgent: AgentConfig = {
  name: 'backend-engineer',
  description: 'Backend/database engineer (Supabase/Postgres by default) — schema, migrations, RLS, auth, storage, APIs, edge functions (Sonnet).',
  prompt: loadAgentPrompt('backend-engineer'),
  model: 'sonnet',
  defaultModel: 'sonnet',
  metadata: BACKEND_ENGINEER_PROMPT_METADATA,
};
