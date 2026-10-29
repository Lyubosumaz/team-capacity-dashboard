// Package teams answers the routes about teams and their members.
package teams

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/database"
)

type Team struct {
	ID      string   `json:"id" db:"id"`
	Name    string   `json:"name" db:"name"`
	OwnerID string   `json:"ownerId" db:"owner_id"`
	Members []Member `json:"members" db:"-"`
}

// Member is a user in a team. ID is the user's ID; Name is their email.
type Member struct {
	ID                string  `json:"id"`
	Name              string  `json:"name"`
	Role              string  `json:"role"`
	TimeForTeam       string  `json:"timeForTeam"`
	Access            string  `json:"access"`
	Skills            []Skill `json:"skills"`
	CapacityPerSprint int     `json:"capacityPerSprint"`
	IsKeyPerson       bool    `json:"isKeyPerson"`
}

type Skill struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Category string `json:"category"`
}

// ErrNotFound means there's no team with that ID.
var ErrNotFound = errors.New("team not found")

// Store reads teams from the database.
type Store struct {
	db *pgxpool.Pool
}

func NewStore(db *pgxpool.Pool) *Store {
	return &Store{db: db}
}

// List returns every team with its members, sorted by name.
func (s *Store) List(ctx context.Context) ([]Team, error) {
	rows, err := s.db.Query(ctx,
		`SELECT id, name, owner_id FROM teams ORDER BY lower(name)`,
	)
	if err != nil {
		return nil, err
	}

	teams, err := pgx.CollectRows(rows, pgx.RowToStructByName[Team])
	if err != nil {
		return nil, err
	}

	return teams, s.addMembers(ctx, teams)
}

// Get returns one team with its members.
func (s *Store) Get(ctx context.Context, id string) (Team, error) {
	if !database.IsID(id) {
		return Team{}, ErrNotFound
	}

	rows, err := s.db.Query(ctx,
		`SELECT id, name, owner_id FROM teams WHERE id = $1`, id,
	)
	if err != nil {
		return Team{}, err
	}

	team, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[Team])
	if errors.Is(err, pgx.ErrNoRows) {
		return Team{}, ErrNotFound
	}
	if err != nil {
		return Team{}, err
	}

	teams := []Team{team}
	if err := s.addMembers(ctx, teams); err != nil {
		return Team{}, err
	}
	return teams[0], nil
}

// addMembers fills in the members of the teams, with their skills.
func (s *Store) addMembers(ctx context.Context, teams []Team) error {
	if len(teams) == 0 {
		return nil
	}

	teamIDs := make([]string, len(teams))
	for i, team := range teams {
		teamIDs[i] = team.ID
	}

	skills, err := s.skillsByMember(ctx, teamIDs)
	if err != nil {
		return err
	}

	rows, err := s.db.Query(ctx, `
		SELECT m.team_id, u.id, u.email, m.role, m.time_for_team, m.access,
		       m.capacity_per_sprint, m.is_key_person
		FROM team_members m
		JOIN users u ON u.id = m.user_id
		WHERE m.team_id = ANY($1::uuid[])
		ORDER BY m.added_at, lower(u.email)`,
		teamIDs,
	)
	if err != nil {
		return err
	}
	defer rows.Close()

	membersByTeam := map[string][]Member{}
	for rows.Next() {
		var teamID string
		var m Member
		err := rows.Scan(&teamID, &m.ID, &m.Name, &m.Role, &m.TimeForTeam,
			&m.Access, &m.CapacityPerSprint, &m.IsKeyPerson)
		if err != nil {
			return err
		}

		m.Skills = skills[teamID+"/"+m.ID]
		if m.Skills == nil {
			m.Skills = []Skill{}
		}
		membersByTeam[teamID] = append(membersByTeam[teamID], m)
	}
	if err := rows.Err(); err != nil {
		return err
	}

	for i := range teams {
		teams[i].Members = membersByTeam[teams[i].ID]
		// So the JSON says [] instead of null.
		if teams[i].Members == nil {
			teams[i].Members = []Member{}
		}
	}
	return nil
}

// skillsByMember returns the members' skills, keyed by "teamID/userID".
func (s *Store) skillsByMember(
	ctx context.Context, teamIDs []string,
) (map[string][]Skill, error) {
	rows, err := s.db.Query(ctx, `
		SELECT ms.team_id, ms.user_id, s.id, s.name, s.category
		FROM team_member_skills ms
		JOIN skills s ON s.id = ms.skill_id
		WHERE ms.team_id = ANY($1::uuid[])
		ORDER BY s.name`,
		teamIDs,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	skills := map[string][]Skill{}
	for rows.Next() {
		var teamID, userID string
		var skill Skill
		err := rows.Scan(&teamID, &userID, &skill.ID, &skill.Name, &skill.Category)
		if err != nil {
			return nil, err
		}

		key := teamID + "/" + userID
		skills[key] = append(skills[key], skill)
	}

	return skills, rows.Err()
}
