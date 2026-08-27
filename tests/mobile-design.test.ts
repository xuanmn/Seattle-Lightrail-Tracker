import { describe, it, expect, beforeEach } from 'vitest';
import { HeaderComponent } from '../src/components/Header';
import { StationPickerModal } from '../src/components/StationPickerModal';
import { FaqModal } from '../src/components/FaqModal';
import { SettingsModal } from '../src/components/SettingsModal';
import { StationCardComponent } from '../src/components/StationCard';
import { Station } from '../src/types/transit';

describe('Mobile Frontend Design & UX Specifications', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders responsive mobile labels and icons on Header action buttons', () => {
    const header = new HeaderComponent('line-1', {
      onMapClick: () => {},
      onFaqClick: () => {},
      onSettingsClick: () => {},
      onLineChange: () => {},
    });

    const el = header.getElement();
    const mapBtn = el.querySelector('.header-map-btn') as HTMLButtonElement;
    expect(mapBtn).not.toBeNull();
    expect(mapBtn.querySelector('.header-btn-label-desktop')?.textContent).toBe('Link Map');
    expect(mapBtn.querySelector('.header-btn-label-mobile')?.textContent).toBe('Map');

    const faqBtn = el.querySelector('.header-faq-btn') as HTMLButtonElement;
    expect(faqBtn).not.toBeNull();
    expect(faqBtn.querySelector('.header-btn-label-desktop')?.textContent).toBe('Transit Guide & FAQ');
    expect(faqBtn.querySelector('.header-btn-label-mobile')?.textContent).toBe('Guide');
  });

  it('renders mobile bottom sheet drag handles on all modal dialogs', () => {
    new StationPickerModal({
      onTogglePin: () => {},
      isStationPinned: () => false,
    });
    new FaqModal();
    new SettingsModal({
      onSettingsSaved: () => {},
    });

    const dragHandles = document.querySelectorAll('.modal-drag-handle');
    expect(dragHandles.length).toBeGreaterThanOrEqual(3);
  });

  it('supports real-time search filtering in StationPickerModal for fast mobile station discovery', () => {
    const picker = new StationPickerModal({
      onTogglePin: () => {},
      isStationPinned: () => false,
    });

    picker.open('line-1');

    const searchInput = document.querySelector('.picker-search-input') as HTMLInputElement;
    expect(searchInput).not.toBeNull();

    // Type "westlake" into search input
    searchInput.value = 'westlake';
    searchInput.dispatchEvent(new Event('input'));

    const visibleRows = document.querySelectorAll('.picker-station-row');
    expect(visibleRows.length).toBe(1);
    expect(visibleRows[0].textContent).toContain('Westlake');

    // Clear search
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    const allRows = document.querySelectorAll('.picker-station-row');
    expect(allRows.length).toBeGreaterThan(1);
  });

  it('renders thumb-friendly directional segmented controls on StationCard', () => {
    const mockStation: Station = {
      id: 'westlake',
      name: 'Westlake',
      lines: ['line-1'],
      lat: 47.61,
      lon: -122.33,
      platforms: {
        northbound: { stopId: '1', directionName: 'Northbound', cardinalDirection: 'Northbound', terminalDestination: 'Lynnwood' },
        southbound: { stopId: '2', directionName: 'Southbound', cardinalDirection: 'Southbound', terminalDestination: 'Federal Way' },
      },
    };

    const card = new StationCardComponent(mockStation, false, false, {
      onTogglePin: () => {},
    });

    const el = card.getElement();
    const segmented = el.querySelector('.direction-segmented-control');
    expect(segmented).not.toBeNull();

    const segmentBtns = segmented?.querySelectorAll('.direction-segment-btn');
    expect(segmentBtns?.length).toBe(3); // Both, North, South
  });
});
