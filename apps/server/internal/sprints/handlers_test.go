package sprints_test

import (
	"net/http"
	"reflect"
	"testing"

	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/sprints"
	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/testutil"
)

func TestListSprints(t *testing.T) {
	db := testutil.Database(t)
	mux := http.NewServeMux()
	sprints.Routes(mux, sprints.NewStore(db))

	insertSprint := func(name, start, end string) sprints.Sprint {
		id := testutil.InsertID(t, db, `
			INSERT INTO sprints (name, start_date, end_date)
			VALUES ($1, $2, $3) RETURNING id`, name, start, end)
		return sprints.Sprint{ID: id, Name: name, StartDate: start, EndDate: end}
	}
	second := insertSprint("Sprint 2", "2026-11-16", "2026-11-29")
	first := insertSprint("Sprint 1", "2026-11-02", "2026-11-15")

	var got []sprints.Sprint
	status := testutil.Get(t, mux, "/sprints", &got)

	want := []sprints.Sprint{first, second}
	if status != http.StatusOK || !reflect.DeepEqual(got, want) {
		t.Errorf("got %d %+v\nwant %+v", status, got, want)
	}
}
