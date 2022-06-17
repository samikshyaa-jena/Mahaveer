import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankchallanComponent } from './bankchallan.component';

describe('BankchallanComponent', () => {
  let component: BankchallanComponent;
  let fixture: ComponentFixture<BankchallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankchallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankchallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
