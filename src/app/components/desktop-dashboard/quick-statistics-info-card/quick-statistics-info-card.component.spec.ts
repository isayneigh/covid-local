import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickStatisticsInfoCardComponent } from './quick-statistics-info-card.component';

describe('QuickStatisticsInfoCardComponent', () => {
  let component: QuickStatisticsInfoCardComponent;
  let fixture: ComponentFixture<QuickStatisticsInfoCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickStatisticsInfoCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickStatisticsInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
