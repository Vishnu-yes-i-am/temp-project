import { Component, Input } from '@angular/core';
import { EditMetaDataViewModel } from '../vm/edit-metadata.view-model';
import { ImageMetadataViewModel } from '../vm/image-metadata.view-model';

@Component({
  selector: 'app-image-metadata-form',
  templateUrl: './image-metadata-form.component.html',
  styleUrls: ['./image-metadata-form.component.scss']
})
export class ImageMetadataFormComponent<T extends ImageMetadataViewModel> {

  @Input()
  public imageMetaDataForEdit!: EditMetaDataViewModel<T>;
  constructor() { }
  parseDate(ev: Event): Date {
    let value: string = (ev?.target as HTMLInputElement).value
    if (value)
        return new Date(value);
    return new Date(0);
  }
}
