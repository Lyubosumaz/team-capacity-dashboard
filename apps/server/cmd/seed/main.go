// Replaces everything in the local database with the demo data in
// seed.sql. Run it with pnpm seed. It refuses to touch any database that
// isn't on this computer.
package main

import (
	"context"
	_ "embed"
	"errors"
	"fmt"
	"log"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/config"
	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/database"
)

//go:embed seed.sql
var seedSQL string

// Every table with data, emptied before seeding.
const allTables = `users, teams, team_members, skills, team_member_skills,
	sprints, projects, risk_rules, risk_insights, risk_events`

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	ctx := context.Background()

	cfg, err := config.Load()
	if err != nil {
		return err
	}
	if err := checkIsLocal(cfg.DatabaseURL); err != nil {
		return err
	}

	db, err := database.Connect(ctx, cfg.DatabaseURL)
	if err != nil {
		return err
	}
	defer db.Close()

	if err := database.Migrate(ctx, db); err != nil {
		return err
	}

	// All or nothing: if the seed fails, the old data stays.
	tx, err := db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	if _, err := tx.Exec(ctx, "TRUNCATE "+allTables+" CASCADE"); err != nil {
		return err
	}
	if _, err := tx.Exec(ctx, seedSQL); err != nil {
		return fmt.Errorf("seed.sql: %w", err)
	}
	if err := tx.Commit(ctx); err != nil {
		return err
	}

	log.Print("The local database now holds the demo data.")
	return nil
}

// checkIsLocal stops the seed from wiping a hosted database by mistake.
func checkIsLocal(url string) error {
	cfg, err := pgxpool.ParseConfig(url)
	if err != nil {
		return err
	}

	host := cfg.ConnConfig.Host
	isLocal := host == "localhost" || host == "127.0.0.1" || host == "::1" ||
		strings.HasPrefix(host, "/") // a socket file on this computer

	if !isLocal {
		return errors.New("the seed only runs on a local database, not " + host)
	}
	return nil
}
