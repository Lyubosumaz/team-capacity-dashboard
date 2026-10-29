package risk

import (
	"net/http"

	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/database"
	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/respond"
)

// Routes adds the risk routes to mux.
func Routes(mux *http.ServeMux, store *Store) {
	mux.HandleFunc("GET /risk/rules", func(w http.ResponseWriter, r *http.Request) {
		rules, err := store.ListRules(r.Context())
		if err != nil {
			respond.ServerError(w, r, err)
			return
		}

		respond.JSON(w, http.StatusOK, rules)
	})

	// GET /risk/insights?teamId=… returns only that team's insights.
	mux.HandleFunc("GET /risk/insights", func(w http.ResponseWriter, r *http.Request) {
		teamID, ok := teamIDFilter(w, r)
		if !ok {
			return
		}

		insights, err := store.ListInsights(r.Context(), teamID)
		if err != nil {
			respond.ServerError(w, r, err)
			return
		}

		respond.JSON(w, http.StatusOK, insights)
	})

	// GET /risk/events?teamId=… returns only that team's events.
	mux.HandleFunc("GET /risk/events", func(w http.ResponseWriter, r *http.Request) {
		teamID, ok := teamIDFilter(w, r)
		if !ok {
			return
		}

		events, err := store.ListEvents(r.Context(), teamID)
		if err != nil {
			respond.ServerError(w, r, err)
			return
		}

		respond.JSON(w, http.StatusOK, events)
	})
}

// teamIDFilter reads the optional ?teamId=…. When it isn't a valid ID, it
// answers 400 and returns false.
func teamIDFilter(w http.ResponseWriter, r *http.Request) (string, bool) {
	teamID := r.URL.Query().Get("teamId")
	if teamID != "" && !database.IsID(teamID) {
		respond.Error(w, http.StatusBadRequest, "teamId must be a team ID.")
		return "", false
	}

	return teamID, true
}
