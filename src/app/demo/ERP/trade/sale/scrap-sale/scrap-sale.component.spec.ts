import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrapSaleComponent } from './scrap-sale.component';

describe('ScrapSaleComponent', () => {
  let component: ScrapSaleComponent;
  let fixture: ComponentFixture<ScrapSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrapSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrapSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
