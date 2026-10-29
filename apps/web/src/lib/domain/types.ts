export type Skill = {
  id: string;
  name: string;
  category?: string;
};

// A Firebase account, copied to the `users` collection when its owner logs
// in, so others can add them to teams. The ID is the account's UID.
export type UserProfile = {
  id: string;
  email: string;
};

export type Member = {
  // The member's account UID.
  id: string;
  name: string;
  role: string;
  skills: Skill[];
  capacityPerSprint: number;
  isKeyPerson?: boolean;
};

export type Team = {
  id: string;
  name: string;
  // The user who created the team; only they can see and change it.
  // Old sample teams have none.
  ownerId?: string;
  members: Member[];
};

export type Sprint = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  sprintId: string;
  estimatedEffort: number;
};

export type RiskRule = {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
};

export type RiskInsight = {
  id: string;
  ruleId: string;
  teamId?: string;
  memberId?: string;
  projectId?: string;
  sprintId?: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
};

export type RiskEvent = {
  id: string;
  teamId: string;
  memberId?: string;
  date: string;
  type: 'vacation' | 'absence' | 'key_person_unavailable';
  description: string;
};

export type CapacitySnapshot = {
  sprintId: string;
  sprintName: string;
  capacity: number;
  workload: number;
};
