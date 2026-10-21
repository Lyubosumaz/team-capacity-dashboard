describe('Dashboard flows', () => {
  it('can view team list and team detail', () => {
    cy.visit('/');
    cy.contains('a', /teams/i).click();
    cy.get("a[href^='/teams/']").first().click();
    cy.contains('h2', /members & capacity/i).should('be.visible');
  });

  it('shows teams over capacity widget', () => {
    cy.visit('/');
    cy.contains('h2', /teams over capacity/i).should('be.visible');
  });
});
