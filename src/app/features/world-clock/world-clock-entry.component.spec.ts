/**
 * World Clock Entry Component Tests (T021-T023)
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorldClockEntryComponent } from './world-clock-entry.component';
import { WorldClockEntry } from './models/world-clock.models';

describe('WorldClockEntryComponent', () => {
  let component: WorldClockEntryComponent;
  let fixture: ComponentFixture<WorldClockEntryComponent>;

  const mockEntry: WorldClockEntry = {
    id: 'test',
    region: 'Test Region',
    city: 'Test City',
    timeZoneId: 'America/New_York',
    locale: 'en-US',
    currentTime: new Date(),
    utcOffset: -300,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldClockEntryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorldClockEntryComponent);
    component = fixture.componentInstance;
    component.entry = mockEntry;
    component.format = 'digital';
    component.use24Hour = true;
    component.showDialMarks = true;
  });

  it('should render region name and city name correctly (T021)', () => {
    fixture.detectChanges();
    const regionName = fixture.nativeElement.querySelector('.region-name');
    const cityName = fixture.nativeElement.querySelector('.city-name');

    expect(regionName.textContent).toContain('Test Region');
    expect(cityName.textContent).toContain('Test City');
  });

  it('should render formatted time in digital format (T021)', () => {
    component.format = 'digital';
    component.use24Hour = true;
    fixture.detectChanges();
    const digitalClock = fixture.nativeElement.querySelector('.digital-clock');

    expect(digitalClock).toBeTruthy();
    expect(digitalClock.textContent).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it('should render AM/PM marker when 12-hour mode is selected', () => {
    component.use24Hour = false;
    fixture.detectChanges();
    const digitalClock = fixture.nativeElement.querySelector('.digital-clock');

    expect(digitalClock.textContent).toMatch(/AM|PM/i);
  });

  it('should have ARIA labels for accessibility (T022)', () => {
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('mat-card');
    const digitalClock = fixture.nativeElement.querySelector('.digital-clock');

    expect(card.getAttribute('role')).toBe('region');
    expect(card.getAttribute('aria-label')).toContain('Test Region');
    expect(card.getAttribute('aria-label')).toContain('Test City');
    expect(digitalClock.getAttribute('aria-live')).toBe('polite');
  });

  it('should display UTC offset correctly', () => {
    fixture.detectChanges();
    const utcOffset = fixture.nativeElement.querySelector('.utc-offset');

    expect(utcOffset.textContent).toContain('UTC-5');
  });

  it('should render analog dial with markers and numerals when enabled', () => {
    component.format = 'analog';
    component.showDialMarks = true;
    fixture.detectChanges();

    const markers = fixture.nativeElement.querySelector('.analog-clock__markers');
    const numerals = fixture.nativeElement.querySelector('.analog-clock__numerals');

    expect(markers).toBeTruthy();
    expect(numerals).toBeTruthy();
  });

  it('should render clean analog dial without markers and numerals when disabled', () => {
    component.format = 'analog';
    component.showDialMarks = false;
    fixture.detectChanges();

    const markers = fixture.nativeElement.querySelector('.analog-clock__markers');
    const numerals = fixture.nativeElement.querySelector('.analog-clock__numerals');

    expect(markers).toBeNull();
    expect(numerals).toBeNull();
  });
});
