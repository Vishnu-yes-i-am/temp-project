import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSingleRecordComponent } from './edit-single-record.component';

describe('EditSingleRecordComponent', () => {
  let component: EditSingleRecordComponent;
  let fixture: ComponentFixture<EditSingleRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSingleRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSingleRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
