package users_test

import (
	"net/http"
	"reflect"
	"testing"

	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/testutil"
	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/users"
)

func TestListUsers(t *testing.T) {
	db := testutil.Database(t)
	mux := http.NewServeMux()
	users.Routes(mux, users.NewStore(db))

	ben := testutil.InsertID(t, db,
		`INSERT INTO users (email, role) VALUES ('Ben@example.com', 'admin') RETURNING id`)
	ana := testutil.InsertID(t, db,
		`INSERT INTO users (email) VALUES ('ana@example.com') RETURNING id`)

	var got []users.User
	status := testutil.Get(t, mux, "/users", &got)

	// Sorted by email, whatever the capital letters.
	want := []users.User{
		{ID: ana, Email: "ana@example.com", Role: "user"},
		{ID: ben, Email: "Ben@example.com", Role: "admin"},
	}
	if status != http.StatusOK || !reflect.DeepEqual(got, want) {
		t.Errorf("got %d %+v\nwant %+v", status, got, want)
	}
}
