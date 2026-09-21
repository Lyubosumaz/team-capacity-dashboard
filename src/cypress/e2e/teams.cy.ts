describe("Teams pages", () => {
  it("shows teams list", () => {
    cy.visit("/teams");
    cy.get("a[href^='/teams/']").its("length").should("be.greaterThan", 0);
  });

  it("shows team detail with members, projects and charts", () => {
    cy.visit("/");
    cy.contains("a", /teams/i).click();
    cy.get("a[href^='/teams/']").first().click();
    cy.contains("h2", /members & capacity/i).should("be.visible");
    cy.contains("h2", /projects & risks/i).should("be.visible");
    cy.contains("h2", /capacity & workload/i).should("be.visible");
  });
});
