import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrapSaleAddComponent } from './scrap-sale-add.component';

describe('ScrapSaleAddComponent', () => {
  let component: ScrapSaleAddComponent;
  let fixture: ComponentFixture<ScrapSaleAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrapSaleAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrapSaleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
