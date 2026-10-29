package teams_test

import (
	"net/http"
	"reflect"
	"testing"

	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/teams"
	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/testutil"
)

func TestTeamRoutes(t *testing.T) {
	db := testutil.Database(t)
	mux := http.NewServeMux()
	teams.Routes(mux, teams.NewStore(db))

	owner := testutil.InsertID(t, db,
		`INSERT INTO users (email) VALUES ('owner@example.com') RETURNING id`)
	ana := testutil.InsertID(t, db,
		`INSERT INTO users (email) VALUES ('ana@example.com') RETURNING id`)
	web := testutil.InsertID(t, db,
		`INSERT INTO teams (name, owner_id) VALUES ('Web', $1) RETURNING id`, owner)
	api := testutil.InsertID(t, db,
		`INSERT INTO teams (name, owner_id) VALUES ('Api', $1) RETURNING id`, owner)
	react := testutil.InsertID(t, db,
		`INSERT INTO skills (name, category) VALUES ('React', 'Engineering') RETURNING id`)
	testutil.Exec(t, db, `
		INSERT INTO team_members
			(team_id, user_id, role, time_for_team, access, capacity_per_sprint, is_key_person)
		VALUES ($1, $2, 'Frontend', '14-days', 'full', 8, true)`, web, ana)
	testutil.Exec(t, db,
		`INSERT INTO team_member_skills (team_id, user_id, skill_id) VALUES ($1, $2, $3)`,
		web, ana, react)

	webTeam := teams.Team{
		ID:      web,
		Name:    "Web",
		OwnerID: owner,
		Members: []teams.Member{{
			ID:                ana,
			Name:              "ana@example.com",
			Role:              "Frontend",
			TimeForTeam:       "14-days",
			Access:            "full",
			Skills:            []teams.Skill{{ID: react, Name: "React", Category: "Engineering"}},
			CapacityPerSprint: 8,
			IsKeyPerson:       true,
		}},
	}
	apiTeam := teams.Team{ID: api, Name: "Api", OwnerID: owner, Members: []teams.Member{}}

	t.Run("lists the teams by name, with members and skills", func(t *testing.T) {
		var got []teams.Team
		status := testutil.Get(t, mux, "/teams", &got)

		want := []teams.Team{apiTeam, webTeam}
		if status != http.StatusOK || !reflect.DeepEqual(got, want) {
			t.Errorf("got %d %+v\nwant %+v", status, got, want)
		}
	})

	t.Run("gets one team", func(t *testing.T) {
		var got teams.Team
		status := testutil.Get(t, mux, "/teams/"+web, &got)

		if status != http.StatusOK || !reflect.DeepEqual(got, webTeam) {
			t.Errorf("got %d %+v\nwant %+v", status, got, webTeam)
		}
	})

	t.Run("answers 404 for an unknown or broken ID", func(t *testing.T) {
		for _, id := range []string{"00000000-0000-0000-0000-000000000000", "abc"} {
			var got map[string]string
			if status := testutil.Get(t, mux, "/teams/"+id, &got); status != http.StatusNotFound {
				t.Errorf("GET /teams/%s: got %d, want 404", id, status)
			}
		}
	})
}
