package risk_test

import (
	"net/http"
	"reflect"
	"testing"

	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/risk"
	"github.com/Lyubosumaz/team-capacity-dashboard/apps/server/internal/testutil"
)

func TestRiskRoutes(t *testing.T) {
	db := testutil.Database(t)
	mux := http.NewServeMux()
	risk.Routes(mux, risk.NewStore(db))

	owner := testutil.InsertID(t, db,
		`INSERT INTO users (email) VALUES ('owner@example.com') RETURNING id`)
	web := testutil.InsertID(t, db,
		`INSERT INTO teams (name, owner_id) VALUES ('Web', $1) RETURNING id`, owner)
	api := testutil.InsertID(t, db,
		`INSERT INTO teams (name, owner_id) VALUES ('Api', $1) RETURNING id`, owner)
	rule := testutil.InsertID(t, db, `
		INSERT INTO risk_rules (name, description, severity)
		VALUES ('Overallocation', 'Too much work.', 'high') RETURNING id`)

	lowInsight := testutil.InsertID(t, db, `
		INSERT INTO risk_insights (rule_id, team_id, message, severity)
		VALUES ($1, $2, 'Api is a bit busy.', 'low') RETURNING id`, rule, api)
	highInsight := testutil.InsertID(t, db, `
		INSERT INTO risk_insights (rule_id, team_id, member_id, message, severity)
		VALUES ($1, $2, $3, 'Web is overallocated.', 'high') RETURNING id`, rule, web, owner)

	event := testutil.InsertID(t, db, `
		INSERT INTO risk_events (team_id, date, type, description)
		VALUES ($1, '2026-11-05', 'vacation', 'A week off.') RETURNING id`, web)

	t.Run("lists the rules", func(t *testing.T) {
		var got []risk.Rule
		testutil.Get(t, mux, "/risk/rules", &got)

		want := []risk.Rule{{ID: rule, Name: "Overallocation", Description: "Too much work.", Severity: "high"}}
		if !reflect.DeepEqual(got, want) {
			t.Errorf("got %+v, want %+v", got, want)
		}
	})

	t.Run("lists the insights, most severe first", func(t *testing.T) {
		var got []risk.Insight
		testutil.Get(t, mux, "/risk/insights", &got)

		want := []risk.Insight{
			{ID: highInsight, RuleID: rule, TeamID: &web, MemberID: &owner, Message: "Web is overallocated.", Severity: "high"},
			{ID: lowInsight, RuleID: rule, TeamID: &api, Message: "Api is a bit busy.", Severity: "low"},
		}
		if !reflect.DeepEqual(got, want) {
			t.Errorf("got %+v\nwant %+v", got, want)
		}
	})

	t.Run("filters insights and events by team", func(t *testing.T) {
		var insights []risk.Insight
		testutil.Get(t, mux, "/risk/insights?teamId="+api, &insights)
		if len(insights) != 1 || insights[0].ID != lowInsight {
			t.Errorf("got %+v, want only the Api insight", insights)
		}

		var events []risk.Event
		testutil.Get(t, mux, "/risk/events?teamId="+api, &events)
		if len(events) != 0 {
			t.Errorf("got %+v, want no events for Api", events)
		}
	})

	t.Run("lists the events", func(t *testing.T) {
		var got []risk.Event
		testutil.Get(t, mux, "/risk/events", &got)

		want := []risk.Event{{ID: event, TeamID: web, Date: "2026-11-05", Type: "vacation", Description: "A week off."}}
		if !reflect.DeepEqual(got, want) {
			t.Errorf("got %+v, want %+v", got, want)
		}
	})

	t.Run("refuses a broken team ID", func(t *testing.T) {
		var got map[string]string
		if status := testutil.Get(t, mux, "/risk/events?teamId=web", &got); status != http.StatusBadRequest {
			t.Errorf("got %d, want 400", status)
		}
	})
}
