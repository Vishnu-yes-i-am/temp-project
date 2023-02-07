import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  constructor() { }
  shallowCopy<T>(obj: T):T{
    return JSON.parse(JSON.stringify(obj));
  }
}
