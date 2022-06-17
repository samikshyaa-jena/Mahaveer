import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AadharPayComponent } from './aadhar-pay.component';

describe('AadharPayComponent', () => {
  let component: AadharPayComponent;
  let fixture: ComponentFixture<AadharPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AadharPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AadharPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
