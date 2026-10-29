package teams

import (
	"errors"
	"net/http"

	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/respond"
)

// Routes adds the team routes to mux.
func Routes(mux *http.ServeMux, store *Store) {
	mux.HandleFunc("GET /teams", func(w http.ResponseWriter, r *http.Request) {
		teams, err := store.List(r.Context())
		if err != nil {
			respond.ServerError(w, r, err)
			return
		}

		respond.JSON(w, http.StatusOK, teams)
	})

	mux.HandleFunc("GET /teams/{id}", func(w http.ResponseWriter, r *http.Request) {
		team, err := store.Get(r.Context(), r.PathValue("id"))
		if errors.Is(err, ErrNotFound) {
			respond.Error(w, http.StatusNotFound, "Team not found.")
			return
		}
		if err != nil {
			respond.ServerError(w, r, err)
			return
		}

		respond.JSON(w, http.StatusOK, team)
	})
}
