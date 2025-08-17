import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import Header from '../organisms/Header.vue'

describe('Header Unit Testleri', () => {
  // Mock store oluştur
  const createMockStore = () => {
    return createStore({
      modules: {
        horses: {
          namespaced: true,
          state: { horses: [] },
          getters: { horses: () => [] }
        },
        race: {
          namespaced: true,
          state: { isRaceActive: false },
          getters: { isRaceActive: () => false }
        }
      },
      getters: {
        horses: () => [],
        isRaceActive: () => false
      }
    })
  }

  it('logo doğru render edilmeli', () => {
    const wrapper = mount(Header, {
      global: {
        plugins: [createMockStore()]
      }
    })
    
    expect(wrapper.text()).toContain('🏇 Horse Racing')
  })

  it('alt başlık doğru render edilmeli', () => {
    const wrapper = mount(Header, {
      global: {
        plugins: [createMockStore()]
      }
    })
    
    expect(wrapper.text()).toContain('Professional Racing Simulator')
  })

  it('tüm butonlar mevcut olmalı', () => {
    const wrapper = mount(Header, {
      global: {
        plugins: [createMockStore()]
      }
    })
    
    expect(wrapper.text()).toContain('Generate Horse List')
    expect(wrapper.text()).toContain('Generate Program')
    expect(wrapper.text()).toContain('Start')
    expect(wrapper.text()).toContain('Reset All')
  })

  it('header elementi mevcut olmalı', () => {
    const wrapper = mount(Header, {
      global: {
        plugins: [createMockStore()]
      }
    })
    
    expect(wrapper.find('header').exists()).toBe(true)
  })
})
