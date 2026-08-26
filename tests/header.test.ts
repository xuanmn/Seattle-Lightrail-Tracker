import { describe, it, expect, vi } from 'vitest';
import { HeaderComponent } from '../src/components/Header';

describe('HeaderComponent', () => {
  it('renders header actions including System Map and Guide buttons', () => {
    const onMapClick = vi.fn();
    const onFaqClick = vi.fn();
    const onSettingsClick = vi.fn();
    const onLineChange = vi.fn();

    const header = new HeaderComponent('line-1', false, {
      onMapClick,
      onFaqClick,
      onSettingsClick,
      onLineChange,
    });

    const el = header.getElement();
    expect(el).not.toBeNull();

    const mapBtn = el.querySelector('.header-map-btn') as HTMLButtonElement;
    expect(mapBtn).not.toBeNull();
    mapBtn.click();
    expect(onMapClick).toHaveBeenCalledTimes(1);

    const faqBtn = el.querySelectorAll('.header-text-btn')[1] as HTMLButtonElement;
    expect(faqBtn).not.toBeNull();
    faqBtn.click();
    expect(onFaqClick).toHaveBeenCalledTimes(1);
  });

  it('provides a clickable brand logo with reload capability', () => {
    const header = new HeaderComponent('line-1', false, {
      onMapClick: vi.fn(),
      onFaqClick: vi.fn(),
      onSettingsClick: vi.fn(),
      onLineChange: vi.fn(),
    });

    const el = header.getElement();
    const brand = el.querySelector('.brand-section') as HTMLElement;
    expect(brand).not.toBeNull();
    expect(brand.getAttribute('role')).toBe('button');
    expect(brand.getAttribute('title')).toBe('Reload live tracker');
  });
});
