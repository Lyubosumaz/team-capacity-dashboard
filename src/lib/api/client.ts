import type {
  Project,
  RiskEvent,
  RiskInsight,
  RiskRule,
  Sprint,
  Team,
} from '@/lib/domain/types';

const getJson = async <T>(path: string): Promise<T> => {
  const res = await fetch(path, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Request to ${path} failed with ${res.status}`);
  }

  return (await res.json()) as T;
};

export type RiskBundle = {
  rules: RiskRule[];
  insights: RiskInsight[];
  events: RiskEvent[];
};

export const api = {
  getTeams: () => getJson<Team[]>('/api/teams'),
  getProjects: () => getJson<Project[]>('/api/projects'),
  getSprints: () => getJson<Sprint[]>('/api/sprints'),
  getRiskBundle: () => getJson<RiskBundle>('/api/risk'),
};
