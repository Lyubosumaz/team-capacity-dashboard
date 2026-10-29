-- The first version of every table.

CREATE TABLE users (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email      TEXT NOT NULL,
    role       TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One account per email, whatever the capital letters.
CREATE UNIQUE INDEX users_email_key ON users (lower(email));

CREATE TABLE teams (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL CHECK (name <> ''),
    owner_id   UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Each owner's team names are unique, whatever the capital letters.
CREATE UNIQUE INDEX teams_owner_name_key ON teams (owner_id, lower(name));

-- Who is in which team. The server checks role, time and access against
-- its lists, so those lists can change without a new migration.
CREATE TABLE team_members (
    team_id             UUID NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role                TEXT NOT NULL DEFAULT '',
    time_for_team       TEXT NOT NULL DEFAULT '',
    access              TEXT NOT NULL DEFAULT '',
    capacity_per_sprint INTEGER NOT NULL DEFAULT 0 CHECK (capacity_per_sprint >= 0),
    is_key_person       BOOLEAN NOT NULL DEFAULT false,
    added_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (team_id, user_id)
);

-- For finding a person's teams.
CREATE INDEX team_members_user_id_idx ON team_members (user_id);

CREATE TABLE skills (
    id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name     TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL DEFAULT ''
);

-- Which skills a member brings to a team.
CREATE TABLE team_member_skills (
    team_id  UUID NOT NULL,
    user_id  UUID NOT NULL,
    skill_id UUID NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
    PRIMARY KEY (team_id, user_id, skill_id),
    FOREIGN KEY (team_id, user_id)
        REFERENCES team_members (team_id, user_id) ON DELETE CASCADE
);

CREATE TABLE sprints (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date   DATE NOT NULL CHECK (end_date >= start_date)
);

CREATE TABLE projects (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name             TEXT NOT NULL,
    description      TEXT NOT NULL DEFAULT '',
    team_id          UUID NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
    sprint_id        UUID NOT NULL REFERENCES sprints (id),
    estimated_effort INTEGER NOT NULL DEFAULT 0 CHECK (estimated_effort >= 0)
);

CREATE INDEX projects_team_id_idx ON projects (team_id);

CREATE TABLE risk_rules (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    severity    TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high'))
);

-- A risk found by a rule. It can point at a team, a member, a project
-- and a sprint; each of those is optional.
CREATE TABLE risk_insights (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id    UUID NOT NULL REFERENCES risk_rules (id) ON DELETE CASCADE,
    team_id    UUID REFERENCES teams (id) ON DELETE CASCADE,
    member_id  UUID REFERENCES users (id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects (id) ON DELETE CASCADE,
    sprint_id  UUID REFERENCES sprints (id) ON DELETE CASCADE,
    message    TEXT NOT NULL,
    severity   TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high'))
);

CREATE INDEX risk_insights_team_id_idx ON risk_insights (team_id);

-- Something that lowers a team's capacity, like a vacation.
CREATE TABLE risk_events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id     UUID NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
    member_id   UUID REFERENCES users (id) ON DELETE CASCADE,
    date        DATE NOT NULL,
    type        TEXT NOT NULL
        CHECK (type IN ('vacation', 'absence', 'key_person_unavailable')),
    description TEXT NOT NULL DEFAULT ''
);

CREATE INDEX risk_events_team_id_idx ON risk_events (team_id);
