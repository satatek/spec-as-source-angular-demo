/**
 * World Clock Page Component Tests (T036-T040)
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WorldClockPageComponent } from './world-clock-page.component';
import { WorldClockTimeService } from './services/world-clock-time.service';
import { of, Observable } from 'rxjs';
import { WorldClockEntry } from './models/world-clock.models';

describe('WorldClockPageComponent', () => {
  let component: WorldClockPageComponent;
  let fixture: ComponentFixture<WorldClockPageComponent>;

  const mockEntries: ReadonlyArray<WorldClockEntry> = [
    {
      id: 'brazil',
      region: 'Brazil',
      city: 'Brasília',
      timeZoneId: 'America/Sao_Paulo',
      locale: 'pt-BR',
      currentTime: new Date(),
      utcOffset: -180,
    },
    {
      id: 'uk',
      region: 'United Kingdom',
      city: 'London',
      timeZoneId: 'Europe/London',
      locale: 'en-GB',
      currentTime: new Date(),
      utcOffset: 0,
    },
    {
      id: 'china',
      region: 'China',
      city: 'Shanghai',
      timeZoneId: 'Asia/Shanghai',
      locale: 'zh-CN',
      currentTime: new Date(),
      utcOffset: 480,
    },
  ];

  const mockTimeService = {
    getCurrentTimes(): Observable<ReadonlyArray<WorldClockEntry>> {
      return of(mockEntries);
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldClockPageComponent, BrowserAnimationsModule],
      providers: [{ provide: WorldClockTimeService, useValue: mockTimeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(WorldClockPageComponent);
    component = fixture.componentInstance;
  });

  it('should create page component (T036)', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle format between digital and analog (US2 - T038)', () => {
    expect(component.currentFormat()).toBe('digital');
    
    component.toggleFormat();
    expect(component.currentFormat()).toBe('analog');
    
    component.toggleFormat();
    expect(component.currentFormat()).toBe('digital');
  });

  it('should toggle hour format between 24-hour and AM/PM', () => {
    expect(component.use24Hour()).toBe(true);

    component.toggleHourFormat();
    expect(component.use24Hour()).toBe(false);

    component.toggleHourFormat();
    expect(component.use24Hour()).toBe(true);
  });

  it('should have correct initial format (T036)', () => {
    expect(component.currentFormat()).toBe('digital');
  });

  it('should render page header (T039)', () => {
    fixture.detectChanges();
    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading).toBeTruthy();
    expect(heading.textContent).toContain('World Clock');
  });
});
