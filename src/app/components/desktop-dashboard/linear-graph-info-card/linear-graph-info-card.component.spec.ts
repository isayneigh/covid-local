import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearGraphInfoCardComponent } from './linear-graph-info-card.component';

describe('LinearGraphInfoCardComponent', () => {
  let component: LinearGraphInfoCardComponent;
  let fixture: ComponentFixture<LinearGraphInfoCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinearGraphInfoCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinearGraphInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
