import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSettingsFormComponent } from './search-settings-form.component';

describe('SearchSettingsFormComponent', () => {
  let component: SearchSettingsFormComponent;
  let fixture: ComponentFixture<SearchSettingsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchSettingsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSettingsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
