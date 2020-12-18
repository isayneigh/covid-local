import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopDashboardComponent } from './desktop-dashboard.component';

describe('DesktopDashboardComponent', () => {
  let component: DesktopDashboardComponent;
  let fixture: ComponentFixture<DesktopDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
