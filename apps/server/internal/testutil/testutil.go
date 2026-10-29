// Package testutil has helpers for the server's tests.
package testutil

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/config"
	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/database"
)

// Database gives the test an empty database of its own: a new schema with
// every migration run, dropped when the test ends. So tests can run at the
// same time without seeing each other's rows.
//
// It uses TEST_DATABASE_URL (set in CI), or else the local database from
// docker-compose.yml. If the local one isn't running, the test is skipped.
func Database(t *testing.T) *pgxpool.Pool {
	t.Helper()
	ctx := context.Background()

	url := os.Getenv("TEST_DATABASE_URL")
	isRequired := url != ""
	if !isRequired {
		url = config.LocalDatabaseURL
	}

	admin, err := pgx.Connect(ctx, url)
	if err != nil {
		if isRequired {
			t.Fatalf("connecting to TEST_DATABASE_URL: %v", err)
		}
		t.Skipf("no database to test with (start it with pnpm db:up): %v", err)
	}

	schema := "test_" + randomHex()
	if _, err := admin.Exec(ctx, "CREATE SCHEMA "+schema); err != nil {
		t.Fatal(err)
	}

	cfg, err := pgxpool.ParseConfig(url)
	if err != nil {
		t.Fatal(err)
	}
	// New tables go into the test's schema, and queries read from it.
	cfg.ConnConfig.RuntimeParams["search_path"] = schema

	db, err := pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		t.Fatal(err)
	}

	t.Cleanup(func() {
		db.Close()
		admin.Exec(ctx, "DROP SCHEMA "+schema+" CASCADE")
		admin.Close(ctx)
	})

	if err := database.Migrate(ctx, db); err != nil {
		t.Fatal(err)
	}
	return db
}

// InsertID runs an INSERT … RETURNING id and returns the new row's ID.
func InsertID(t *testing.T, db *pgxpool.Pool, sql string, args ...any) string {
	t.Helper()

	var id string
	if err := db.QueryRow(context.Background(), sql, args...).Scan(&id); err != nil {
		t.Fatalf("%s: %v", sql, err)
	}
	return id
}

// Exec runs SQL that returns nothing, like an INSERT without RETURNING.
func Exec(t *testing.T, db *pgxpool.Pool, sql string, args ...any) {
	t.Helper()

	if _, err := db.Exec(context.Background(), sql, args...); err != nil {
		t.Fatalf("%s: %v", sql, err)
	}
}

// Get sends GET path to handler, reads the JSON answer into out and returns
// the status code.
func Get(t *testing.T, handler http.Handler, path string, out any) int {
	t.Helper()

	recorder := httptest.NewRecorder()
	handler.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, path, nil))

	if err := json.Unmarshal(recorder.Body.Bytes(), out); err != nil {
		t.Fatalf("GET %s: %v\n%s", path, err, recorder.Body)
	}
	return recorder.Code
}

func randomHex() string {
	bytes := make([]byte, 8)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}
