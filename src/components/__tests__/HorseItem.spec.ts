import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HorseItem from '../molecules/HorseItem.vue'

describe('HorseItem Unit Testleri', () => {
  // Test için örnek at verisi
  const testHorse = {
    id: 1,
    name: 'Secretariat',
    condition: 95,
    color: 'Red',
    position: 0,
    isRacing: false
  }

  it('at adı doğru render edilmeli', () => {
    const wrapper = mount(HorseItem, {
      props: { horse: testHorse }
    })
    
    expect(wrapper.text()).toContain('Secretariat')
  })

  it('at kondisyonu doğru render edilmeli', () => {
    const wrapper = mount(HorseItem, {
      props: { horse: testHorse }
    })
    
    expect(wrapper.text()).toContain('95')
  })

  it('at rengi border\'a uygulanmalı', () => {
    const wrapper = mount(HorseItem, {
      props: { horse: testHorse }
    })
    
    const element = wrapper.find('.horse-item')
    expect(element.attributes('style')).toContain('border-left-color: red')
  })

  it('farklı renkler doğru uygulanmalı', () => {
    const blueHorse = { ...testHorse, color: 'Blue' }
    const wrapper = mount(HorseItem, {
      props: { horse: blueHorse }
    })
    
    const element = wrapper.find('.horse-item')
    expect(element.attributes('style')).toContain('border-left-color: blue')
  })

  it('component doğru prop ile render olmalı', () => {
    const wrapper = mount(HorseItem, {
      props: { horse: testHorse }
    })
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Secretariat')
    expect(wrapper.text()).toContain('95')
  })
})
