import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { SearchService } from '../search/search.service';
import { MetadataTypeOpsService } from '../shared-services/metadata-type-ops.service';
import { EditSingleRecordViewModel } from '../vm/edit-single-record.view-model';
import { SingleRecordViewModel } from '../vm/single-record.view-model';

@Component({
  selector: 'app-edit-single-record',
  templateUrl: './edit-single-record.component.html',
  styleUrls: ['./edit-single-record.component.scss']
})
export class EditSingleRecordComponent {

  @Input()
  editSingleRecord: EditSingleRecordViewModel = new EditSingleRecordViewModel(new SingleRecordViewModel, new Date);
  @Output()
  closeEdit: EventEmitter<void> = new EventEmitter;
  @Output()
  editsSaved: EventEmitter<SingleRecordViewModel> = new EventEmitter;
  constructor(private searchService: SearchService, private toastrService: ToastrService, private metadataTypeOpsService: MetadataTypeOpsService) { }

  closeEditClick(): void {
    this.closeEdit.emit();
  }
  async saveEditClick(): Promise<void> {
    try{
      this.editSingleRecord.data.Day = this.editSingleRecord.rawDateInput.getDate().toString();
      this.editSingleRecord.data.Month = (this.editSingleRecord.rawDateInput.getMonth() + 1).toString();
      this.editSingleRecord.data.Year = this.editSingleRecord.rawDateInput.getFullYear().toString();
      let dataWeak:any = this.metadataTypeOpsService.toWeakType(this.editSingleRecord.data);
      await lastValueFrom(this.searchService.updateMetadata(dataWeak));
      this.toastrService.success('Saved successfully');
      this.editsSaved.emit(this.editSingleRecord.data);
      this.closeEditClick();
    }
    catch(err){
      if(err instanceof HttpErrorResponse && err.status === 403)
        this.toastrService.error('Edit access denied');
      else
        this.toastrService.error('Something went wrong');
    }
  }
}
