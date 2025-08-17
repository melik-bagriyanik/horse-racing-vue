import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../atoms/BaseButton.vue'

describe('BaseButton Unit Testleri', () => {
  it('buton metni doğru render edilmeli', () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Tıkla' }
    })
    
    expect(wrapper.text()).toContain('Tıkla')
  })

  it('click event emit edilmeli', async () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Tıkla' }
    })
    
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('varsayılan primary variant uygulanmalı', () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Buton' }
    })
    
    expect(wrapper.classes()).toContain('btn-primary')
  })

  it('secondary variant doğru uygulanmalı', () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'secondary' },
      slots: { default: 'Buton' }
    })
    
    expect(wrapper.classes()).toContain('btn-secondary')
  })

  it('disabled durumu doğru çalışmalı', () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true },
      slots: { default: 'Buton' }
    })
    
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('disabled')
  })

  it('disabled durumda click emit edilmemeli', async () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true },
      slots: { default: 'Buton' }
    })
    
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})
