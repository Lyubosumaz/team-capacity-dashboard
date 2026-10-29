package database_test

import (
	"context"
	"io/fs"
	"testing"

	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/database"
	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/testutil"
	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/migrations"
)

func TestMigrateRunsEachFileOnce(t *testing.T) {
	ctx := context.Background()
	db := testutil.Database(t) // already migrated once

	if err := database.Migrate(ctx, db); err != nil {
		t.Fatalf("running the migrations again: %v", err)
	}

	files, _ := fs.Glob(migrations.Files, "*.sql")
	var ran int
	db.QueryRow(ctx, `SELECT count(*) FROM schema_migrations`).Scan(&ran)
	if ran != len(files) {
		t.Errorf("schema_migrations has %d rows, want %d", ran, len(files))
	}
}

func TestIsID(t *testing.T) {
	cases := map[string]bool{
		"5f0c3c2e-8f1a-4b7e-9c33-0d1e2f3a4b5c": true,
		"5F0C3C2E-8F1A-4B7E-9C33-0D1E2F3A4B5C": true,
		"":                                     false,
		"team-alpha":                           false,
		"5f0c3c2e-8f1a-4b7e-9c33-0d1e2f3a4b5":  false,
	}

	for value, want := range cases {
		if got := database.IsID(value); got != want {
			t.Errorf("IsID(%q) = %v, want %v", value, got, want)
		}
	}
}
