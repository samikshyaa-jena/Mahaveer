import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositslipComponent } from './depositslip.component';

describe('DepositslipComponent', () => {
  let component: DepositslipComponent;
  let fixture: ComponentFixture<DepositslipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositslipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositslipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
