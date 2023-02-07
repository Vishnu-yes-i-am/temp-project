import {
  Directive,
  HostBinding,
  HostListener,
  Output,
  EventEmitter
} from "@angular/core";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export interface FileHandle {
  file: File,
  url: SafeUrl
}

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {
  @Output() files: EventEmitter<FileHandle[]> = new EventEmitter();
  @Output() fileDropWarning: EventEmitter<string> = new EventEmitter();
  @Output() fileDropError: EventEmitter<string> = new EventEmitter();
  
  @HostBinding("style.background") private background = "";

  constructor(private sanitizer: DomSanitizer) { }

  @HostListener("dragover", ["$event"]) 
  public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#999";
  }

  @HostListener("dragleave", ["$event"]) 
  public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "white";
  }

  @HostListener('drop', ['$event']) 
  public async onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "white";
    let files: FileHandle[] = [];
    var length = evt.dataTransfer!.items.length;
    let webkitEntries = [];
    /**
     * ############ ASYNCHRONOUS BEHAVIOR OF readEntries() AND file() ##############
     * 
     * 1. there is no event or callback for when they are done
     *    So we wrap the entire thing in a Promise and resolve it manually. In getAllFilesHandlesAsync we track progress with count
     *    This way the entire operation is made awaitable
     * 
     * 2. evt.dataTransfer!.items ends up getting garbage collected during the async operations. So we prepare webkitGetAsEntry() and take a backup outside the scope in webkitEntries
     * 
     * All of these are experimental features as of writing this comment. Behavior is subject to change, therefore it is recommended to investigate better approaches in future.
     * - Adri (adriyaman.banerjee@gmail.com),
     *   April 2nd, 2022
     */
    for (var i = 0; i < length; i++){
      let dataTransferItem = evt.dataTransfer!.items[i]
      if(typeof dataTransferItem.webkitGetAsEntry !== 'function' && dataTransferItem.kind !== 'file'){
        if(dataTransferItem.kind !==  'directory'){
          this.fileDropError.emit('Something went wrong');
          return;
        }
        else
          this.fileDropWarning.emit('Folder upload is not supported')
      }
      webkitEntries.push(evt.dataTransfer!.items[i].webkitGetAsEntry());
    }
      
    for (var i = 0; i < length; i++) {
      var webkitEntry:any = webkitEntries[i]
      if(webkitEntry?.isFile){
        let fileHandle = await this.getFileHandleAsync(webkitEntry) as FileHandle;
        files.push(fileHandle)
      }
      else if(webkitEntry?.isDirectory){
        let directoryReader = webkitEntry.createReader();
        let filesRead =  await this.getAllFilesHandlesAsync(directoryReader);
        for(var file of filesRead)
          files.push(file)
      }
      
    }
    if (files.length > 0) {
      this.files.emit(files);
    }
  }
  prepareFileHandle(file: any) {
    let url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
    return {file, url};
  }
  getAllFilesHandlesAsync(directoryReader: any): Promise<FileHandle[]> {
    let files: any[] = []
    let count = 0;
    return new Promise((resolve, reject) => {
      directoryReader.readEntries((entries: any)=> {
        entries.forEach(async (entry:any) => {
          let file = await this.getFileHandleAsync(entry);
          files.push(file);
          count++;
          if(count === entries.length)
            resolve(files);
        });
      })
    })
  }
  getFileHandleAsync(webkitEntry: any){
    return new Promise((resolve, reject) => {
      webkitEntry.file(async (file: any) => {
        resolve(this.prepareFileHandle(file))
      });
    })
  }
  readFilesAsync(webkitEntry: any): FileHandle[] | PromiseLike<FileHandle[]> {
    return new Promise((resolve, reject) => {
      let filesFound: FileHandle[] = [];
      let directoryReader = webkitEntry.createReader();
      directoryReader.readEntries((entries: any) => {
        entries.forEach((entry: any) => {
          entry.file((file: any) => {
            
          });
        });
      });
      resolve(filesFound)
    })
  }
}
