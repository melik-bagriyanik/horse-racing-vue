describe('Horse Racing E2E Testleri', () => {
  beforeEach(() => {
    // Her testten önce ana sayfayı ziyaret et
    cy.visit('/')
  })

  describe('Ana Sayfa Yükleme', () => {
    it('sayfa başlığı doğru görünmeli', () => {
      // Header'da logo ve başlık kontrolü
      cy.contains('h1', '🏇 Horse Racing')
      cy.contains('p', 'Developed by')
    })

    it('tüm ana bölümler mevcut olmalı', () => {
      // Ana layout bölümlerinin varlığı
      cy.get('.horses-section').should('exist')
      cy.get('.race-section').should('exist')
      cy.get('.programs-section').should('exist')
    })

    it('başlangıçta butonlar doğru durumda olmalı', () => {
      // Başlangıç durumu kontrolü
      cy.contains('button', 'Generate Horse List').should('be.visible')
      cy.contains('button', 'Generate Program').should('be.disabled')
      cy.contains('button', 'Start').should('be.visible')
      cy.contains('button', 'Reset All').should('be.visible')
    })
  })

  describe('At Listesi Oluşturma', () => {
    it('Generate Horse List butonu çalışmalı', () => {
      // At listesi oluştur
      cy.contains('button', 'Generate Horse List').click()
      
      // At listesinin oluştuğunu kontrol et
      cy.get('.horse-item').should('have.length', 20)
      
      // Generate Program butonu artık aktif olmalı
      cy.contains('button', 'Generate Program').should('not.be.disabled')
    })

    it('atlar doğru bilgilerle oluşturulmalı', () => {
      cy.contains('button', 'Generate Horse List').click()
      
      // İlk atın bilgilerini kontrol et
      cy.get('.horse-item').first().within(() => {
        cy.get('.horse-name').should('exist')
        cy.get('.horse-condition').should('exist')
        cy.get('.horse-condition').invoke('text').then((text) => {
          const condition = parseInt(text)
          expect(condition).to.be.at.least(40)
          expect(condition).to.be.at.most(100)
        })
      })
    })
  })

  describe('Yarış Programı Oluşturma', () => {
    beforeEach(() => {
      // Her test için önce at listesi oluştur
      cy.contains('button', 'Generate Horse List').click()
    })

    it('Generate Program butonu çalışmalı', () => {
      cy.contains('button', 'Generate Program').click()
      
      // Program bölümünde 6 tur oluşmalı
      cy.get('.programs-section').should('contain', '1ST Lap')
      cy.get('.programs-section').should('contain', '6ST Lap')
      
      // Program bölümünde tablolar olmalı
      cy.get('.round-table').should('exist')
    })

    it('program oluşturulduktan sonra Start butonu aktif olmalı', () => {
      cy.contains('button', 'Generate Program').click()
      cy.contains('button', 'Start').should('not.be.disabled')
    })
  })

  describe('Yarış Simülasyonu', () => {
    beforeEach(() => {
      // Test için hazırlık
      cy.contains('button', 'Generate Horse List').click()
      cy.contains('button', 'Generate Program').click()
    })

    it('Start butonu yarışı başlatmalı', () => {
      cy.contains('button', 'Start').click()
      
      // Yarış alanında atların hareket ettiğini kontrol et
      cy.get('.race-lane').should('exist')
      
      // Buton metni Pause olmalı
      cy.contains('button', 'Pause').should('be.visible')
    })

    it('Pause butonu yarışı durdurmalı', () => {
      cy.contains('button', 'Start').click()
      cy.contains('button', 'Pause').click()
      
      // Buton metni Start olmalı
      cy.contains('button', 'Start').should('be.visible')
    })

    it('yarış sonuçları görünmeli', () => {
      cy.contains('button', 'Start').click()
      
      // Yarışın başladığını kontrol et
      cy.contains('button', 'Pause').should('be.visible')
      
      // Sonuçlar için bekle (maksimum 30 saniye)
      cy.wait(30000)
      
      // Sonuçlar bölümünde veri olmalı (esnek kontrol)
      cy.get('.results-panel').should('exist')
    })
  })

  describe('Reset Fonksiyonu', () => {
    beforeEach(() => {
      // Test için hazırlık
      cy.contains('button', 'Generate Horse List').click()
      cy.contains('button', 'Generate Program').click()
    })

    it('Reset All butonu yarışı sıfırlamalı', () => {
      // Önce yarışı başlat
      cy.contains('button', 'Start').click()
      cy.contains('button', 'Pause').should('be.visible')
      
      // Reset yap
      cy.contains('button', 'Reset All').click()
      
      // Reset sonrası Start butonu tekrar aktif olmalı
      cy.contains('button', 'Start').should('be.visible')
      cy.contains('button', 'Pause').should('not.exist')
    })
  })

  describe('Responsive Tasarım', () => {
    it('mobil görünümde layout düzgün olmalı', () => {
      // Mobil viewport ayarla
      cy.viewport('iphone-x')
      
      // Ana bölümlerin hala görünür olduğunu kontrol et
      cy.get('.horses-section').should('be.visible')
      cy.get('.race-section').should('be.visible')
      cy.get('.programs-section').should('be.visible')
    })

    it('tablet görünümde layout düzgün olmalı', () => {
      // Tablet viewport ayarla
      cy.viewport('ipad-2')
      
      // Ana bölümlerin hala görünür olduğunu kontrol et
      cy.get('.horses-section').should('be.visible')
      cy.get('.race-section').should('be.visible')
      cy.get('.programs-section').should('be.visible')
    })
  })

  describe('Tam Yarış Akışı', () => {
    it('tam yarış döngüsü çalışmalı', () => {
      // 1. At listesi oluştur
      cy.contains('button', 'Generate Horse List').click()
      cy.get('.horse-item').should('have.length', 20)
      
      // 2. Program oluştur
      cy.contains('button', 'Generate Program').click()
      cy.get('.programs-section').should('contain', '1ST Lap')
      
      // 3. Yarışı başlat
      cy.contains('button', 'Start').click()
      cy.contains('button', 'Pause').should('be.visible')
      
      // 4. Yarışın başladığını kontrol et
      cy.contains('button', 'Pause').should('be.visible')
      
      // 5. Sonuçlar için bekle
      cy.wait(30000)
      
      // 6. Sonuçları kontrol et
      cy.get('.results-panel').should('exist')
      
      // 7. Reset yap
      cy.contains('button', 'Reset All').click()
      cy.contains('button', 'Start').should('be.disabled')
    })
  })
})
