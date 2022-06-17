import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualaccountComponent } from './virtualaccount.component';

describe('VirtualaccountComponent', () => {
  let component: VirtualaccountComponent;
  let fixture: ComponentFixture<VirtualaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
