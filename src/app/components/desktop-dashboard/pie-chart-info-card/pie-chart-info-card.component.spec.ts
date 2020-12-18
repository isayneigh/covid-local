import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartInfoCardComponent } from './pie-chart-info-card.component';

describe('PieChartInfoCardComponent', () => {
  let component: PieChartInfoCardComponent;
  let fixture: ComponentFixture<PieChartInfoCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartInfoCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
