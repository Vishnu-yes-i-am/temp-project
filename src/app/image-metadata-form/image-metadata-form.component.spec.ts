import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageMetadataFormComponent } from './image-metadata-form.component';

describe('ImageMetadataFormComponent', () => {
  let component: ImageMetadataFormComponent;
  let fixture: ComponentFixture<ImageMetadataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageMetadataFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageMetadataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
