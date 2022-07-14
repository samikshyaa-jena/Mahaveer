import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqEntryComponent } from './req-entry.component';

describe('ReqEntryComponent', () => {
  let component: ReqEntryComponent;
  let fixture: ComponentFixture<ReqEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
