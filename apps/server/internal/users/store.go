// Package users answers the routes about accounts.
package users

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type User struct {
	ID    string `json:"id" db:"id"`
	Email string `json:"email" db:"email"`
	Role  string `json:"role" db:"role"`
}

// Store reads users from the database.
type Store struct {
	db *pgxpool.Pool
}

func NewStore(db *pgxpool.Pool) *Store {
	return &Store{db: db}
}

// List returns every user, sorted by email.
func (s *Store) List(ctx context.Context) ([]User, error) {
	rows, err := s.db.Query(ctx,
		`SELECT id, email, role FROM users ORDER BY lower(email)`,
	)
	if err != nil {
		return nil, err
	}

	return pgx.CollectRows(rows, pgx.RowToStructByName[User])
}
