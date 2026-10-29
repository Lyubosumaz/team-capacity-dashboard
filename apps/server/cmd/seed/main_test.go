package main

import (
	"context"
	"testing"

	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/testutil"
)

func TestSeedSQLFillsEveryTable(t *testing.T) {
	ctx := context.Background()
	db := testutil.Database(t)

	if _, err := db.Exec(ctx, seedSQL); err != nil {
		t.Fatalf("seed.sql: %v", err)
	}

	for _, table := range []string{
		"users", "teams", "team_members", "skills", "team_member_skills",
		"sprints", "projects", "risk_rules", "risk_insights", "risk_events",
	} {
		var count int
		db.QueryRow(ctx, "SELECT count(*) FROM "+table).Scan(&count)
		if count == 0 {
			t.Errorf("%s is empty after the seed", table)
		}
	}
}

func TestCheckIsLocal(t *testing.T) {
	local := []string{
		"postgres://postgres:postgres@localhost:5432/team_capacity",
		"postgres://postgres@127.0.0.1/team_capacity",
	}
	for _, url := range local {
		if err := checkIsLocal(url); err != nil {
			t.Errorf("%s: %v, want it allowed", url, err)
		}
	}

	if err := checkIsLocal("postgres://user:pw@db.example.com:5432/prod"); err == nil {
		t.Error("a hosted database should be refused")
	}
}
