import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError, isEmpty, map, mapTo, tap } from 'rxjs/operators';
import { Pokemon, QueryParams } from './pokemon.model';
import { PokemonStore } from './pokemon.store';
import { Apollo, gql } from 'apollo-angular';
import { environment } from 'src/environments/environment';
import { PokemonQuery } from './pokemon.query';
import { CommonService } from '../common.service';

@Injectable({ providedIn: 'root' },
)
export class PokemonService {
  url = environment.endpoint + 'pokemon';
  constructor(private pokemonStore: PokemonStore, private http: HttpClient,
    private messageService: MessageService,
    private pokemonQuery: PokemonQuery,
    private commonService : CommonService) {
  }

  setLoading(isLoading : boolean) {
    this.pokemonStore.setLoading(isLoading);
  }

  clear() {
    this.pokemonStore.remove();
  }

  

  get(queryParams: QueryParams) {
    const _url = this.commonService.getQueryString(queryParams) ? `${this.url}${this.commonService.getQueryString(queryParams)}` : this.url;
    return this.http.get<Pokemon[]>(_url).pipe(map((entities: any) => {
      this.pokemonStore.updatePaging({
        next: entities?.['next'] ? entities?.['next'] : null,
        previous: entities?.['previous'],
        count: entities?.['count'],
      });
      
      return [...[], ...entities['results']]
    }));
  }

  addStore(queryParams: QueryParams = {}, isRefresh: boolean = false) {
    if (isRefresh) {
      this.pokemonStore.remove();
    }
    let _pokemons = [...[], ...this.pokemonQuery.getAll()];
    return this.get(queryParams).pipe(
      tap((pokemons: Pokemon[]) => {
        this.setLoading(false);
        const entites = [...[], ..._pokemons, ...pokemons];
        this.pokemonStore.set(entites);
      }),
      catchError(err => {
        this.setLoading(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fail load data' });
        return of(false)
      })
    )
  }

  getDetail(name: string) {
    return this.http.get<Pokemon>(`${this.url}/${name}`).pipe(
      tap((entity: any) => {
        const pokemons = this.pokemonQuery.getAll();
        const exist = pokemons.some(pokemon => {
          return pokemon?.name == entity?.name;
        });
        if (exist) {
          let _entity: any = this.pokemonQuery.getEntity(entity?.name);
          _entity = {..._entity, ...entity};
          this.pokemonStore.update(entity?.name, _entity);
        } else {
          this.pokemonStore.add(entity);
        }
      }));
  }

}
