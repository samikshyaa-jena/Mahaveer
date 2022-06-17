import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AepsStagComponent } from './aeps-stag.component';

describe('AepsStagComponent', () => {
  let component: AepsStagComponent;
  let fixture: ComponentFixture<AepsStagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AepsStagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AepsStagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
