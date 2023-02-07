import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IgnoreHttpEventService {

  private ignoreList: Endpoint[] = [
    new Endpoint('GET', 'search/image?thumbnail=true')
    // Add more as needed...
  ];
  check(url: string, method: string): boolean {
    return this.ignoreList.some(x => x.method === method && url.includes(x.url))
  }
}
class Endpoint{
  method: string;
  url: string;
  constructor(method: string, url: string){
    this.method = method;
    this.url = url;
  }
}