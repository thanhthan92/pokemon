import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { PokemonStore, PokemonState } from './pokemon.store';

@Injectable({ providedIn: 'root' })
export class PokemonQuery extends QueryEntity<PokemonState> {

  constructor(protected store: PokemonStore) {
    super(store);
  }

}
