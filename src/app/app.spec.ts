import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';
import { Homecomponent } from './components/homecomponent/homecomponent';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the SaludCerca landing page at the root route', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/', Homecomponent);
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent)
      .toContain('La salud que necesitas');
  });
});
