import { Injectable } from '@angular/core';
import { ImageMetadataViewModel } from '../vm/image-metadata.view-model';
import { JsonService } from './json.service';

@Injectable({
  providedIn: 'root'
})
export class MetadataTypeOpsService {

  constructor(private jsonService:JsonService) { }
  toWeakType(model: ImageMetadataViewModel): any{
    var weakObj:any = this.jsonService.shallowCopy(model);
    weakObj["Photographer's Name"] = model.PhotographersName;
    weakObj["Scan Tech"] = model.ScanTech;
    weakObj["Equipment #"] = model.Equipment;
    return weakObj;
  }
  toStrongType(weak: any):ImageMetadataViewModel{
    let model: ImageMetadataViewModel = new ImageMetadataViewModel
    model.RR = weak.RR;
    model.Builder = weak.Builder;
    model.Month = weak.Month;
    model.Day = weak.Day;
    model.Year = weak.Year;
    model.ID = weak.ID;
    model.Location = weak.Location;
    model.State = weak.State;
    model.Equipment = weak.Equipment;
    model.Model = weak.Model;
    model.Dir = weak.Dir;
    model.Type = weak.Type;
    model.PhotographersName = weak["Photographer's Name"];
    model.File = weak.File;
    model.ScanTech = weak["Scan Tech"];
    model.Owner = weak.Owner;
    model.Collection = weak.Collection;
    model.Published = weak.Published;
    model.Notes = weak.Notes;
    return model;
  }
}
