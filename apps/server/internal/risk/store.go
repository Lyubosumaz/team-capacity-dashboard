// Package risk answers the routes about risk rules, the risks they found
// (insights) and the events that lower a team's capacity.
package risk

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Severity is "low", "medium" or "high".
type Rule struct {
	ID          string `json:"id" db:"id"`
	Name        string `json:"name" db:"name"`
	Description string `json:"description" db:"description"`
	Severity    string `json:"severity" db:"severity"`
}

// Insight is a risk found by a rule. The *string fields are optional and
// left out of the JSON when empty.
type Insight struct {
	ID        string  `json:"id" db:"id"`
	RuleID    string  `json:"ruleId" db:"rule_id"`
	TeamID    *string `json:"teamId,omitempty" db:"team_id"`
	MemberID  *string `json:"memberId,omitempty" db:"member_id"`
	ProjectID *string `json:"projectId,omitempty" db:"project_id"`
	SprintID  *string `json:"sprintId,omitempty" db:"sprint_id"`
	Message   string  `json:"message" db:"message"`
	Severity  string  `json:"severity" db:"severity"`
}

// Event is something that lowers a team's capacity. Type is "vacation",
// "absence" or "key_person_unavailable"; Date is "YYYY-MM-DD".
type Event struct {
	ID          string  `json:"id" db:"id"`
	TeamID      string  `json:"teamId" db:"team_id"`
	MemberID    *string `json:"memberId,omitempty" db:"member_id"`
	Date        string  `json:"date" db:"date"`
	Type        string  `json:"type" db:"type"`
	Description string  `json:"description" db:"description"`
}

// Store reads risks from the database.
type Store struct {
	db *pgxpool.Pool
}

func NewStore(db *pgxpool.Pool) *Store {
	return &Store{db: db}
}

// ListRules returns every rule, sorted by name.
func (s *Store) ListRules(ctx context.Context) ([]Rule, error) {
	rows, err := s.db.Query(ctx,
		`SELECT id, name, description, severity FROM risk_rules ORDER BY name`,
	)
	if err != nil {
		return nil, err
	}

	return pgx.CollectRows(rows, pgx.RowToStructByName[Rule])
}

// ListInsights returns every insight, or only one team's when teamID isn't
// empty. The most severe come first.
func (s *Store) ListInsights(ctx context.Context, teamID string) ([]Insight, error) {
	query := `SELECT id, rule_id, team_id, member_id, project_id, sprint_id,
		message, severity
		FROM risk_insights`
	var args []any

	if teamID != "" {
		query += ` WHERE team_id = $1`
		args = append(args, teamID)
	}

	rows, err := s.db.Query(ctx, query+`
		ORDER BY array_position(ARRAY['high', 'medium', 'low'], severity), message`,
		args...,
	)
	if err != nil {
		return nil, err
	}

	return pgx.CollectRows(rows, pgx.RowToStructByName[Insight])
}

// ListEvents returns every event, or only one team's when teamID isn't
// empty. The earliest come first.
func (s *Store) ListEvents(ctx context.Context, teamID string) ([]Event, error) {
	query := `SELECT id, team_id, member_id, date::text AS date, type, description
		FROM risk_events`
	var args []any

	if teamID != "" {
		query += ` WHERE team_id = $1`
		args = append(args, teamID)
	}

	rows, err := s.db.Query(ctx, query+` ORDER BY date`, args...)
	if err != nil {
		return nil, err
	}

	return pgx.CollectRows(rows, pgx.RowToStructByName[Event])
}
