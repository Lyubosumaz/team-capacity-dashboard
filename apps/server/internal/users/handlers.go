package users

import (
	"net/http"

	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/respond"
)

// Routes adds the user routes to mux.
func Routes(mux *http.ServeMux, store *Store) {
	mux.HandleFunc("GET /users", func(w http.ResponseWriter, r *http.Request) {
		users, err := store.List(r.Context())
		if err != nil {
			respond.ServerError(w, r, err)
			return
		}

		respond.JSON(w, http.StatusOK, users)
	})
}
