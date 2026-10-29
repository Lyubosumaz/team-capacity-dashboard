package projects

import (
	"net/http"

	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/database"
	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/respond"
)

// Routes adds the project routes to mux.
func Routes(mux *http.ServeMux, store *Store) {
	// GET /projects?teamId=… returns only that team's projects.
	mux.HandleFunc("GET /projects", func(w http.ResponseWriter, r *http.Request) {
		teamID := r.URL.Query().Get("teamId")
		if teamID != "" && !database.IsID(teamID) {
			respond.Error(w, http.StatusBadRequest, "teamId must be a team ID.")
			return
		}

		projects, err := store.List(r.Context(), teamID)
		if err != nil {
			respond.ServerError(w, r, err)
			return
		}

		respond.JSON(w, http.StatusOK, projects)
	})
}
