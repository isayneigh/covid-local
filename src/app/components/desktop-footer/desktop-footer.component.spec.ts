import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopFooterComponent } from './desktop-footer.component';

describe('DesktopFooterComponent', () => {
  let component: DesktopFooterComponent;
  let fixture: ComponentFixture<DesktopFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
