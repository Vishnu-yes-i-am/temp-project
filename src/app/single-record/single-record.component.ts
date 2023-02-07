import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SingleRecordViewModel } from '../vm/single-record.view-model';

@Component({
  selector: 'app-single-record',
  templateUrl: './single-record.component.html',
  styleUrls: ['./single-record.component.scss']
})
export class SingleRecordComponent {

  @Input()
  public singleRecord: SingleRecordViewModel = new SingleRecordViewModel;
  @Input()
  public userPermissions: string[] = [];
  @Output()
  public edit: EventEmitter<SingleRecordViewModel> = new EventEmitter
  @Output()
  public download: EventEmitter<SingleRecordViewModel> = new EventEmitter
  @Output()
  public delete: EventEmitter<SingleRecordViewModel> = new EventEmitter
  disallow(ev: Event): void {
    ev?.preventDefault();
  }
  editClicked(item: SingleRecordViewModel): void {
    this.edit.emit(item)
  }
  downloadClicked(item: SingleRecordViewModel): void {
    this.download.emit(item)
  }
  deleteClicked(item: SingleRecordViewModel): void {
    this.delete.emit(item);
  }
  hasPermission(action: string): boolean {
    return this.userPermissions?.includes(action);
  }
}
