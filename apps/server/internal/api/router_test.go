package api_test

import (
	"net/http"
	"testing"

	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/api"
	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/testutil"
)

func TestHealth(t *testing.T) {
	router := api.NewRouter(testutil.Database(t))

	var got map[string]string
	status := testutil.Get(t, router, "/health", &got)

	if status != http.StatusOK || got["status"] != "ok" {
		t.Errorf("got %d %v, want 200 ok", status, got)
	}
}

func TestEveryListRouteAnswers(t *testing.T) {
	router := api.NewRouter(testutil.Database(t))

	for _, path := range []string{
		"/users", "/teams", "/projects", "/sprints",
		"/risk/rules", "/risk/insights", "/risk/events",
	} {
		// An empty database answers with empty lists, not null.
		var got []any
		status := testutil.Get(t, router, path, &got)

		if status != http.StatusOK || got == nil {
			t.Errorf("GET %s: got %d %v, want 200 []", path, status, got)
		}
	}
}
