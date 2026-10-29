// Package projects answers the routes about projects.
package projects

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Project struct {
	ID              string `json:"id" db:"id"`
	Name            string `json:"name" db:"name"`
	Description     string `json:"description" db:"description"`
	TeamID          string `json:"teamId" db:"team_id"`
	SprintID        string `json:"sprintId" db:"sprint_id"`
	EstimatedEffort int    `json:"estimatedEffort" db:"estimated_effort"`
}

// Store reads projects from the database.
type Store struct {
	db *pgxpool.Pool
}

func NewStore(db *pgxpool.Pool) *Store {
	return &Store{db: db}
}

// List returns the projects sorted by name: every project, or only one
// team's when teamID isn't empty.
func (s *Store) List(ctx context.Context, teamID string) ([]Project, error) {
	query := `SELECT id, name, description, team_id, sprint_id, estimated_effort
		FROM projects`
	var args []any

	if teamID != "" {
		query += ` WHERE team_id = $1`
		args = append(args, teamID)
	}

	rows, err := s.db.Query(ctx, query+` ORDER BY lower(name)`, args...)
	if err != nil {
		return nil, err
	}

	return pgx.CollectRows(rows, pgx.RowToStructByName[Project])
}
