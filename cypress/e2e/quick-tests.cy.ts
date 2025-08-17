describe('Hızlı E2E Testleri', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('ana sayfa yüklenmeli', () => {
    // Temel sayfa kontrolü
    cy.contains('🏇 Horse Racing').should('be.visible')
    cy.get('.horses-section').should('exist')
    cy.get('.race-section').should('exist')
    cy.get('.programs-section').should('exist')
  })

  it('at listesi oluşturulabilmeli', () => {
    // At listesi oluşturma testi
    cy.contains('Generate Horse List').click()
    cy.get('.horse-item').should('have.length', 20)
    cy.contains('Generate Program').should('not.be.disabled')
  })

  it('program oluşturulabilmeli', () => {
    // Program oluşturma testi
    cy.contains('Generate Horse List').click()
    cy.contains('Generate Program').click()
    cy.contains('1ST Lap').should('exist')
    cy.contains('6ST Lap').should('exist')
  })

  it('yarış başlatılabilmeli', () => {
    // Yarış başlatma testi
    cy.contains('Generate Horse List').click()
    cy.contains('Generate Program').click()
    cy.contains('Start').click()
    cy.contains('Pause').should('be.visible')
  })

  it('reset çalışmalı', () => {
    // Reset fonksiyonu testi
    cy.contains('Generate Horse List').click()
    cy.contains('Generate Program').click()
    cy.contains('Reset All').click()
    cy.get('.horses-section').should('not.contain', '🐎')
  })
})
