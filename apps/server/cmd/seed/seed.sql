-- Demo data for local development. pnpm seed runs this after emptying
-- every table. Rows point at each other by name or email, so no IDs are
-- needed here.

INSERT INTO users (email, role) VALUES
    ('demo@example.com', 'admin'),
    ('alex@example.com', 'user'),
    ('blake@example.com', 'user'),
    ('jordan@example.com', 'user'),
    ('dana@example.com', 'user'),
    ('eli@example.com', 'user'),
    ('fern@example.com', 'user');

-- Every demo team belongs to demo@example.com.
INSERT INTO teams (name, owner_id)
SELECT team.name, owner.id
FROM (VALUES ('Team Alpha'), ('Team Bravo'), ('Team Delta')) AS team (name)
JOIN users owner ON owner.email = 'demo@example.com';

INSERT INTO team_members
    (team_id, user_id, role, time_for_team, access, capacity_per_sprint, is_key_person)
SELECT t.id, u.id, m.role, m.time_for_team, m.access, m.capacity, m.is_key_person
FROM (VALUES
    ('Team Alpha', 'alex@example.com', 'Full-stack', '2-years', 'full', 30, true),
    ('Team Alpha', 'blake@example.com', 'Frontend', '31-days', 'read-only', 25, false),
    ('Team Bravo', 'jordan@example.com', 'Backend', '2-years', 'full', 28, false),
    ('Team Bravo', 'dana@example.com', 'Frontend', '14-days', 'read-only', 22, false),
    ('Team Delta', 'eli@example.com', 'Backend', '2-years', 'full', 20, false),
    ('Team Delta', 'fern@example.com', 'Designer', '31-days', 'full', 18, false)
) AS m (team, email, role, time_for_team, access, capacity, is_key_person)
JOIN teams t ON t.name = m.team
JOIN users u ON u.email = m.email;

INSERT INTO skills (name, category) VALUES
    ('Frontend', 'Engineering'),
    ('Backend', 'Engineering'),
    ('DevOps', 'Engineering'),
    ('Data', 'Engineering'),
    ('UX', 'Design');

INSERT INTO team_member_skills (team_id, user_id, skill_id)
SELECT t.id, u.id, s.id
FROM (VALUES
    ('Team Alpha', 'alex@example.com', 'Frontend'),
    ('Team Alpha', 'alex@example.com', 'Backend'),
    ('Team Alpha', 'blake@example.com', 'Frontend'),
    ('Team Bravo', 'jordan@example.com', 'Backend'),
    ('Team Bravo', 'dana@example.com', 'Frontend'),
    ('Team Bravo', 'dana@example.com', 'Data'),
    ('Team Delta', 'eli@example.com', 'Data'),
    ('Team Delta', 'fern@example.com', 'UX')
) AS ms (team, email, skill)
JOIN teams t ON t.name = ms.team
JOIN users u ON u.email = ms.email
JOIN skills s ON s.name = ms.skill;

-- Two-week sprints: the current one, the one before and the one after.
INSERT INTO sprints (name, start_date, end_date)
SELECT 'Sprint ' || n,
       current_date + (n - 2) * 14,
       current_date + (n - 2) * 14 + 13
FROM generate_series(1, 3) AS n;

INSERT INTO projects (name, description, team_id, sprint_id, estimated_effort)
SELECT p.name, p.description, t.id, s.id, p.effort
FROM (VALUES
    ('Capacity Dashboard', 'Internal tooling for capacity planning.', 'Team Alpha', 'Sprint 1', 60),
    ('Internal Tools', 'Backlog work, light effort.', 'Team Bravo', 'Sprint 2', 20),
    ('ML Platform', 'New internal machine learning platform.', 'Team Delta', 'Sprint 2', 45),
    ('Design System Refresh', 'Revamp of shared UI components.', 'Team Delta', 'Sprint 3', 30)
) AS p (name, description, team, sprint, effort)
JOIN teams t ON t.name = p.team
JOIN sprints s ON s.name = p.sprint;

INSERT INTO risk_rules (name, description, severity) VALUES
    ('Team overallocation', 'Team workload exceeds available capacity.', 'high'),
    ('Key person dependency', 'Too much work depends on a single key person.', 'medium'),
    ('Low team capacity', 'Team has very low total capacity this sprint.', 'medium'),
    ('Upcoming heavy project', 'Large project scheduled in an upcoming sprint.', 'low');

INSERT INTO risk_insights (rule_id, team_id, sprint_id, message, severity)
SELECT r.id, t.id, s.id, i.message, r.severity
FROM (VALUES
    ('Team overallocation', 'Team Alpha', 'Sprint 1', 'Team Alpha is at risk of being overallocated in Sprint 1.'),
    ('Low team capacity', 'Team Bravo', 'Sprint 2', 'Team Bravo has low available capacity in Sprint 2.'),
    ('Upcoming heavy project', 'Team Delta', 'Sprint 3', 'Team Delta has a heavy project scheduled in Sprint 3.')
) AS i (rule, team, sprint, message)
JOIN risk_rules r ON r.name = i.rule
JOIN teams t ON t.name = i.team
JOIN sprints s ON s.name = i.sprint;

INSERT INTO risk_events (team_id, member_id, date, type, description)
SELECT t.id, u.id, current_date + e.days_from_today, e.type, e.description
FROM (VALUES
    ('Team Alpha', 'alex@example.com', 3, 'vacation', 'Alex is on vacation for 3 days.'),
    ('Team Bravo', 'jordan@example.com', 5, 'absence', 'Jordan is at an offsite for a day.'),
    ('Team Delta', 'eli@example.com', 16, 'absence', 'Eli is speaking at a conference.')
) AS e (team, email, days_from_today, type, description)
JOIN teams t ON t.name = e.team
JOIN users u ON u.email = e.email;
