import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleRecordComponent } from './single-record.component';

describe('SingleRecordComponent', () => {
  let component: SingleRecordComponent;
  let fixture: ComponentFixture<SingleRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
