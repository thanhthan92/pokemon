import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { QueryParams } from '../../state/pokemon.model';
import { Item } from './item.model';
import { ItemsQuery } from './items.query';
import { ItemsStore } from './items.store';

@Injectable({ providedIn: 'root' })
export class ItemsService {
  url: string = environment.endpoint + 'item';
  constructor(private itemsStore: ItemsStore,
    private http: HttpClient,
    private messageService: MessageService,
    private itemQuery: ItemsQuery) {
  }


  get(queryParams: QueryParams) {
    const _url =  queryParams?.limit ? `${this.url}?limit=${queryParams?.limit}` : queryParams?.offset ? `${this.url}?offset=${queryParams?.offset}}` : this.url;
    return this.http.get<Item[]>(_url).pipe(
      map((entities: any) => {
      return [...[], ...entities['results']]
      }),
      tap((items: Item[]) => {
        this.itemsStore.setLoading(false);
        this.itemsStore.set(items);
      }),
      catchError(err => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Fail load data'});
        this.itemsStore.setLoading(false);
        return of(false)
      })
      );
  }


  getDetail(name: string) {
    return this.http.get<Item>(`${this.url}/${name}`).pipe(
      tap((entity: any) => {
      const items = this.itemQuery.getAll();
      const exist = items.some(item => {
        return item?.name == entity?.name;
      });
      if(exist) {
        this.itemsStore.update(entity?.name, entity);
      } else {
        this.itemsStore.add(entity);
      }
    }));
  }

}
