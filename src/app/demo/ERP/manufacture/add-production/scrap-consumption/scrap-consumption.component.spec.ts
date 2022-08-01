import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrapConsumptionComponent } from './scrap-consumption.component';

describe('ScrapConsumptionComponent', () => {
  let component: ScrapConsumptionComponent;
  let fixture: ComponentFixture<ScrapConsumptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrapConsumptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrapConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
