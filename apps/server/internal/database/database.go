// Package database connects to PostgreSQL and builds the tables.
package database

import (
	"context"
	"fmt"
	"io/fs"
	"regexp"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/migrations"
)

// Connect opens a pool of connections and checks that the database answers.
func Connect(ctx context.Context, url string) (*pgxpool.Pool, error) {
	db, err := pgxpool.New(ctx, url)
	if err != nil {
		return nil, fmt.Errorf("reading the database URL: %w", err)
	}

	if err := db.Ping(ctx); err != nil {
		db.Close()
		return nil, fmt.Errorf("the database doesn't answer (is it running? try pnpm db:up): %w", err)
	}

	return db, nil
}

// Migrate runs the files in migrations/ that haven't run yet, in file-name
// order, and remembers each one in the schema_migrations table.
func Migrate(ctx context.Context, db *pgxpool.Pool) error {
	_, err := db.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS schema_migrations (
			name       TEXT PRIMARY KEY,
			applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
		)`)
	if err != nil {
		return fmt.Errorf("creating schema_migrations: %w", err)
	}

	// Sorted by name, so 0001_… runs before 0002_….
	names, err := fs.Glob(migrations.Files, "*.sql")
	if err != nil {
		return err
	}

	for _, name := range names {
		if err := runMigration(ctx, db, name); err != nil {
			return fmt.Errorf("migration %s: %w", name, err)
		}
	}

	return nil
}

// runMigration runs one file, unless it ran before. The file and its record
// are saved together, so a file that fails leaves nothing behind.
func runMigration(ctx context.Context, db *pgxpool.Pool, name string) error {
	tx, err := db.Begin(ctx)
	if err != nil {
		return err
	}
	// Does nothing once the transaction is committed.
	defer tx.Rollback(ctx)

	// Waits while another server is migrating, so files never run twice.
	if _, err := tx.Exec(ctx, `SELECT pg_advisory_xact_lock(4444)`); err != nil {
		return err
	}

	var alreadyRan bool
	err = tx.QueryRow(ctx,
		`SELECT EXISTS (SELECT 1 FROM schema_migrations WHERE name = $1)`,
		name,
	).Scan(&alreadyRan)
	if err != nil {
		return err
	}
	if alreadyRan {
		return nil
	}

	sql, err := migrations.Files.ReadFile(name)
	if err != nil {
		return err
	}
	if _, err := tx.Exec(ctx, string(sql)); err != nil {
		return err
	}
	if _, err := tx.Exec(ctx,
		`INSERT INTO schema_migrations (name) VALUES ($1)`, name,
	); err != nil {
		return err
	}

	return tx.Commit(ctx)
}

var idPattern = regexp.MustCompile(
	`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`,
)

// IsID reports whether s looks like a row ID (a UUID). Check IDs from
// requests with it, because PostgreSQL fails on anything else.
func IsID(s string) bool {
	return idPattern.MatchString(s)
}
