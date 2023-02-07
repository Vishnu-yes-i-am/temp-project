import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ImportService } from './import.service';
import { LoginService } from '../login/login.service';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { FileHandle } from '../directives/drag-drop.directive';
import { ImportEntityViewModel } from '../vm/import-entity-view-model';
import * as XLSX from 'xlsx';
import { AddedFileViewModel } from '../vm/added-file-view-model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EditImportEntityViewModel } from '../vm/edit-import-entity-view-model';
import { JsonService } from '../shared-services/json.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MetadataTypeOpsService } from '../shared-services/metadata-type-ops.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  @ViewChild("fileUpload")
  public fileUpload!: TemplateRef<any>;
  addedFiles: AddedFileViewModel[] = [];
  importList: ImportEntityViewModel[] = [];
  modalRef: BsModalRef = new BsModalRef();
  metaDataForm: EditImportEntityViewModel = new EditImportEntityViewModel();
  constructor(private importService: ImportService,
    private loginService: LoginService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private jsonService: JsonService,
    private sanitizer: DomSanitizer,
    private metadataTypeOpsService:MetadataTypeOpsService) { }

  async ngOnInit(): Promise<void> {
    try{
      await lastValueFrom(this.importService.validateAccess());
      this.loginService.grantAccess();
    }
    catch(err){
      if(err instanceof HttpErrorResponse && err.status === 403)
        this.loginService.denyAccess();
      else
        this.toastr.error('Something went wrong')
    }
  }
  async filesDropped(files: FileHandle[]){
    this.modalRef.hide();
    files.map((x:FileHandle) => {
      this.addedFiles.push(new AddedFileViewModel(x))
    })
    await this.init();
  }
  async init() {
    await this.parseValidateAndFillAsync();
    this.mapGridDataToImages();
    this.mapImagesToGridData();
  }
  mapImagesToGridData() {
    var imageFileHandles: AddedFileViewModel[] = this.addedFiles.filter(x => !x.fileHandle.file.name.endsWith('.csv'));
    for(var img of imageFileHandles) {
      if(img.hasBeenProcessed) 
        continue;
      if(!this.importList.some(x => x.File === img.fileHandle.file.name)) {
        var model:ImportEntityViewModel = new ImportEntityViewModel();
        model.File = img.fileHandle.file.name;
        this.importList.push(model)
        img.hasNoMapping = true;
      }
      else if(img.hasBeenProcessed)
        img.hasNoMapping = false;
      img.hasBeenProcessed = true;
    }
  }
  mapGridDataToImages() {
    this.importList.forEach((value: ImportEntityViewModel)=>{
      if(!this.addedFiles.filter(x => x.fileHandle.file.name === value.File).length)
        value.hasNoMapping = true;
      else
        value.hasNoMapping = false;
    })
  }
  toModel(v: any, fileName: string): ImportEntityViewModel{
    var entry: ImportEntityViewModel = this.metadataTypeOpsService.toStrongType(v) as ImportEntityViewModel;
    entry.srcCsv = fileName;
    return entry;
  }
  convertImportListToWeakType(): object[] {
    var result: object[] = [];
    for(var v of this.importList)
      result.push(this.metadataTypeOpsService.toWeakType(v));
    return result;
  }
  async parseValidateAndFillAsync(): Promise<void> {
    for(let addedFile of this.addedFiles){
      if(addedFile.fileHandle.file.name.endsWith('.csv')) {
        if(addedFile.hasBeenProcessed) // Already added to grid
          continue;
        var csvFile: File = addedFile.fileHandle.file;
        var buffer: ArrayBuffer = await this.readCsvFileAsync(csvFile);
        var book: XLSX.WorkBook = XLSX.read(buffer);
        var sheet: XLSX.WorkSheet = book.Sheets[book.SheetNames[0]];
        var jsonRaw:any[] = XLSX.utils.sheet_to_json(sheet);
        for(var v of jsonRaw) {
          var entry: ImportEntityViewModel = this.toModel(v, csvFile.name)
          if(this.importList.some(x => x.File === entry.File)) {
            this.resetWithError('You must enter unique file names in CSV')
            return;
          }
          this.importList.push(entry);
        }
        addedFile.hasBeenProcessed = true;
      }
      else if(this.addedFiles.filter(x => x.fileHandle.file.name === addedFile.fileHandle.file.name).length > 1) {
        this.resetWithError('Image file names must be unique');
        return;
      }
    }
  }
  resetWithError(errorMsg: string): void {
    this.importList = [];
    this.addedFiles = [];
    this.toastr.error(errorMsg);
  }
  readCsvFileAsync(csvFile: File):Promise<ArrayBuffer> {
    return new Promise((resolve, reject)=>{
      var reader: FileReader = new FileReader();
      reader.onload = (loadResult) => {
        var buffer:ArrayBuffer = loadResult.target?.result as ArrayBuffer;
        resolve(buffer);
      }
      reader.onerror = reject;
      reader.readAsArrayBuffer(csvFile);
    })
  }
  async removeAddedFile(index: number):Promise<void>{
    var fileName:string = this.addedFiles[index].fileHandle.file.name;
    this.addedFiles.splice(index, 1);
    await this.init();
    if(fileName.endsWith(".csv"))
      this.importList = this.importList.filter(x => x.srcCsv !== fileName);
    else
      this.importList = this.importList.filter(x => x.File !== fileName);
  }
  async removeImportListEntry(index: number):Promise<void>{
    var csvSrc:string = this.getCsvAndSetDirty(index);
    if(!csvSrc)
      this.removeAddedFile(this.addedFiles.findIndex(x => x.fileHandle.file.name === this.importList[index].File))
    this.addedFiles = this.addedFiles.filter(x => x.fileHandle.file.name !== this.importList[index].File);
    this.importList.splice(index, 1);
    await this.init();
  }
  getCsvAndSetDirty(index: number):string{
    var srcCsv:string = this.importList[index].srcCsv;
    if(srcCsv)
      this.addedFiles.filter(x => x.fileHandle.file.name === srcCsv)[0].isDirty = true;
    return srcCsv;
  }
  openModal(template: TemplateRef<any>):void{
    this.modalRef = this.modalService.show(template);
  }
  editImportListEntryOpen(index: number):void{
    this.metaDataForm.show = true;
    this.metaDataForm.data = this.jsonService.shallowCopy(this.importList[index])
    this.metaDataForm.rawDateInput = new Date(`${this.metaDataForm.data.Month}-${this.metaDataForm.data.Day}-${this.metaDataForm.data.Year}`)
  }
  closeEdit():void{
    this.metaDataForm = new EditImportEntityViewModel();
  }
  saveEdit():void{
    var index:number = this.importList.findIndex(x => x.srcCsv === this.metaDataForm.data.srcCsv && x.File === this.metaDataForm.data.File);
    if(index + this.metaDataForm.replicate > this.importList.length - 1){
      this.toastr.error(`Cannot repeat entry ${this.metaDataForm.replicate} time(s) - not enough rows in grid`);
      return;
    }
    this.metaDataForm.data.Day = new Date(this.metaDataForm.rawDateInput).getDate().toString();
    this.metaDataForm.data.Month = (new Date(this.metaDataForm.rawDateInput).getMonth() + 1).toString();
    this.metaDataForm.data.Year = new Date(this.metaDataForm.rawDateInput).getFullYear().toString();
    for(var i = 0; i <= this.metaDataForm.replicate; i++){
      var fileNameTemp:string = this.importList[index + i].File;
      this.importList[index + i] = this.jsonService.shallowCopy(this.metaDataForm.data);
      this.importList[index + i].File = fileNameTemp;
      this.getCsvAndSetDirty(index + i);
      this.confirmDataFilled(this.importList[index + i].File);
    }
    this.closeEdit();
  }
  confirmDataFilled(fname: string):void {
    this.addedFiles.filter(x => x.fileHandle.file.name === fname)[0].hasDataFilled = true;
  }
  async doSubmit():Promise<void>{
    try{
      if(this.addedFiles.some(x => x.hasNoMapping && !x.hasDataFilled)){
        this.toastr.error('Please fill metadata for highlighted image(s)')
        return;
      }
      if(this.importList.some(x => x.hasNoMapping)){
        this.toastr.error("Please add highlighted image(s)")
        return;
      }
      var formData:FormData = new FormData();
      for(var addedFile of this.addedFiles){
        if(!addedFile.fileHandle.file.name.endsWith('.csv'))
          formData.append('fileBinary', addedFile.fileHandle.file, addedFile.fileHandle.file.name)
      }
      var weakImportList:any[] = this.convertImportListToWeakType()
      formData.append('csvData', JSON.stringify(weakImportList));
      await lastValueFrom(this.importService.doImport(formData));
      this.toastr.success('Saved successfully')
      this.addedFiles = [];
      this.importList = [];
      this.init();
    }
    catch(err){
      this.toastr.error('Something went wrong')
    }
  }
  async onFileSelected(event: any): Promise<void> {
    var files:FileList = event.target.files;
    if (files && files.length) {
      var handles: FileHandle[] = []
      for(var i = 0; i < files.length; i++){
        handles.push({
          file: files.item(i) as File,
          url:this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(files.item(i) as File))
        })
      }
      await this.filesDropped(handles)
    }
    event.target.files = null;
  }
  uploadClick(): void {
    (this.fileUpload as any).nativeElement.click();
  }
}
