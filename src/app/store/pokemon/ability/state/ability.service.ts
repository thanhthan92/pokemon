import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../../common.service';
import { QueryParams } from '../../state/pokemon.model';
import { Ability } from './ability.model';
import { AbilityQuery } from './ability.query';
import { AbilityStore } from './ability.store';

@Injectable({ providedIn: 'root' })
export class AbilityService {
  url: string = environment.endpoint + 'ability';
  constructor(private abilityStore: AbilityStore, private http: HttpClient,
    private messageService: MessageService,
    private commonService : CommonService,
    private abilityQuery: AbilityQuery) {
  }

  setLoading(isLoading: boolean) {
    this.abilityStore.setLoading(isLoading);
  }


  get(queryParams: QueryParams) {
    const _url = this.commonService.getQueryString(queryParams) ? `${this.url}${this.commonService.getQueryString(queryParams)}` : this.url;
    return this.http.get<Ability[]>(_url).pipe(
      map((entities: any) => {
      return [...[], ...entities['results']]
      }),
      tap((items: Ability[]) => {
        this.abilityStore.setLoading(false);
        this.abilityStore.set(items);
      }),
      catchError(err => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Fail load data'});
        this.abilityStore.setLoading(false);
        return of(false)
      })
      );
  }


  getDetail(name: string, url: string = '') {
    const _url = url != '' ? url : `${this.url}/${name}`;
    return this.http.get<Ability>(_url).pipe(
      tap((entity: any) => {
      const items = this.abilityQuery.getAll();
      const exist = items.some(item => {
        return item?.name == entity?.name;
      });
      if(exist) {
        this.abilityStore.update(entity?.name, entity);
      } else {
        this.abilityStore.add(entity);
      }
      this.abilityStore.setLoading(false);
    }));
  }

  add(ability: Ability) {
    this.abilityStore.add(ability);
  }

  update(name : string, ability: Partial<Ability>) {
    this.abilityStore.update(name, ability);
  }

  remove(id: ID) {
    this.abilityStore.remove(id);
  }

}
