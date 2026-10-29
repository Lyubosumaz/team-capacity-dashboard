package projects_test

import (
	"net/http"
	"reflect"
	"testing"

	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/projects"
	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/testutil"
)

func TestProjectRoutes(t *testing.T) {
	db := testutil.Database(t)
	mux := http.NewServeMux()
	projects.Routes(mux, projects.NewStore(db))

	owner := testutil.InsertID(t, db,
		`INSERT INTO users (email) VALUES ('owner@example.com') RETURNING id`)
	web := testutil.InsertID(t, db,
		`INSERT INTO teams (name, owner_id) VALUES ('Web', $1) RETURNING id`, owner)
	api := testutil.InsertID(t, db,
		`INSERT INTO teams (name, owner_id) VALUES ('Api', $1) RETURNING id`, owner)
	sprint := testutil.InsertID(t, db, `
		INSERT INTO sprints (name, start_date, end_date)
		VALUES ('Sprint 1', '2026-11-02', '2026-11-15') RETURNING id`)

	insertProject := func(name, teamID string) projects.Project {
		id := testutil.InsertID(t, db, `
			INSERT INTO projects (name, description, team_id, sprint_id, estimated_effort)
			VALUES ($1, 'About '||$1, $2, $3, 10) RETURNING id`, name, teamID, sprint)
		return projects.Project{
			ID: id, Name: name, Description: "About " + name,
			TeamID: teamID, SprintID: sprint, EstimatedEffort: 10,
		}
	}
	shop := insertProject("Shop", web)
	billing := insertProject("Billing", api)

	t.Run("lists every project by name", func(t *testing.T) {
		var got []projects.Project
		status := testutil.Get(t, mux, "/projects", &got)

		want := []projects.Project{billing, shop}
		if status != http.StatusOK || !reflect.DeepEqual(got, want) {
			t.Errorf("got %d %+v\nwant %+v", status, got, want)
		}
	})

	t.Run("lists one team's projects", func(t *testing.T) {
		var got []projects.Project
		testutil.Get(t, mux, "/projects?teamId="+web, &got)

		if want := []projects.Project{shop}; !reflect.DeepEqual(got, want) {
			t.Errorf("got %+v, want %+v", got, want)
		}
	})

	t.Run("refuses a broken team ID", func(t *testing.T) {
		var got map[string]string
		if status := testutil.Get(t, mux, "/projects?teamId=web", &got); status != http.StatusBadRequest {
			t.Errorf("got %d, want 400", status)
		}
	})
}
