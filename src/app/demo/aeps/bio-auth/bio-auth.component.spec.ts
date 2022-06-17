import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BioAuthComponent } from './bio-auth.component';

describe('BioAuthComponent', () => {
  let component: BioAuthComponent;
  let fixture: ComponentFixture<BioAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BioAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BioAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
