// Package sprints answers the routes about sprints.
package sprints

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Sprint dates are "YYYY-MM-DD".
type Sprint struct {
	ID        string `json:"id" db:"id"`
	Name      string `json:"name" db:"name"`
	StartDate string `json:"startDate" db:"start_date"`
	EndDate   string `json:"endDate" db:"end_date"`
}

// Store reads sprints from the database.
type Store struct {
	db *pgxpool.Pool
}

func NewStore(db *pgxpool.Pool) *Store {
	return &Store{db: db}
}

// List returns every sprint, the earliest first.
func (s *Store) List(ctx context.Context) ([]Sprint, error) {
	rows, err := s.db.Query(ctx, `
		SELECT id, name, start_date::text AS start_date, end_date::text AS end_date
		FROM sprints
		ORDER BY start_date`,
	)
	if err != nil {
		return nil, err
	}

	return pgx.CollectRows(rows, pgx.RowToStructByName[Sprint])
}
