import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  getQueryString(obj: Object | any) {
    let queryString = '';
    Object.keys(obj).map((key: any, index) => {
      if(obj[key] && obj[key] != '') {
        if(index === 0) {
          queryString += `?${key}=${obj[key]}`;
        } else {
          queryString += `&${key}=${obj[key]}`;
        }
      }
    });
    return queryString;
  }
}
