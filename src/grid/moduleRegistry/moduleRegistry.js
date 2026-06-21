export const MODULE_REGISTRY = [
  {
    id: 'grid-home',
    name: 'Grid Home',
    status: 'Shell',
    accent: 'cyan',
    iconType: 'grid',
    summary: 'The Grid overview for project status, local reports, prompts, audio, and settings.',
    sections: ['overview', 'inbox', 'reports', 'prompts', 'settings'],
  },
  {
    id: 'meridian-port',
    name: 'Meridian Port',
    status: 'Active',
    accent: 'orange',
    icon: '/meridian-checklist-icon.svg',
    summary: 'Mission-control surface for Meridian readiness, smoke evidence, prompts, reports, and audio.',
    sections: ['readiness', 'smoke tests', 'evidence', 'reports'],
  },
];

export function getModule(moduleId) {
  return MODULE_REGISTRY.find((module) => module.id === moduleId);
}

export function getFallbackModule() {
  return MODULE_REGISTRY[0];
}
