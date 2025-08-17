import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HorseConditionBar from '../atoms/HorseConditionBar.vue'

describe('HorseConditionBar Unit Testleri', () => {
  // Test için örnek at verisi
  const testHorse = {
    id: 1,
    name: 'Secretariat',
    condition: 95,
    color: 'Red',
    position: 0,
    isRacing: false
  }

  it('condition bar doğru genişlikte render edilmeli', () => {
    const wrapper = mount(HorseConditionBar, { props: { horse: testHorse } })
    const conditionBar = wrapper.find('.condition-bar')
    expect(conditionBar.exists()).toBe(true)
    expect(conditionBar.attributes('style')).toContain('width: 95%')
  })

  it('yüksek kondisyon için yeşil renk kullanmalı', () => {
    const highConditionHorse = { ...testHorse, condition: 90 }
    const wrapper = mount(HorseConditionBar, { props: { horse: highConditionHorse } })
    const conditionBar = wrapper.find('.condition-bar')
    expect(conditionBar.attributes('style')).toContain('#10b981')
  })

  it('orta kondisyon için turuncu renk kullanmalı', () => {
    const mediumConditionHorse = { ...testHorse, condition: 70 }
    const wrapper = mount(HorseConditionBar, { props: { horse: mediumConditionHorse } })
    const conditionBar = wrapper.find('.condition-bar')
    expect(conditionBar.attributes('style')).toContain('#f59e0b')
  })

  it('düşük kondisyon için kırmızı renk kullanmalı', () => {
    const lowConditionHorse = { ...testHorse, condition: 30 }
    const wrapper = mount(HorseConditionBar, { props: { horse: lowConditionHorse } })
    const conditionBar = wrapper.find('.condition-bar')
    expect(conditionBar.attributes('style')).toContain('#ef4444')
  })

  it('component doğru prop ile render olmalı', () => {
    const wrapper = mount(HorseConditionBar, { props: { horse: testHorse } })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.condition-bar-container').exists()).toBe(true)
  })
})
