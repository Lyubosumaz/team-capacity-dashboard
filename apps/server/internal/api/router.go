// Package api puts every route of the API together.
package api

import (
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/projects"
	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/respond"
	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/risk"
	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/sprints"
	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/teams"
	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/users"
)

// NewRouter returns the handler for every route of the API.
func NewRouter(db *pgxpool.Pool) http.Handler {
	mux := http.NewServeMux()

	// For checking that the server and its database are up.
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		if err := db.Ping(r.Context()); err != nil {
			respond.Error(w, http.StatusServiceUnavailable, "The database doesn't answer.")
			return
		}

		respond.JSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	users.Routes(mux, users.NewStore(db))
	teams.Routes(mux, teams.NewStore(db))
	projects.Routes(mux, projects.NewStore(db))
	sprints.Routes(mux, sprints.NewStore(db))
	risk.Routes(mux, risk.NewStore(db))

	return mux
}
