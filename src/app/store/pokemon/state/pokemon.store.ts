import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Pokemon } from './pokemon.model';

// export interface PokemonState extends EntityState<Pokemon> {}
export interface PokemonState extends EntityState<Pokemon> {
  ui: {
    count?: number,
    next?:  string | any,
    previous?:string | any
  };
}
const initialState = {
  ui: {
    count: 0,
    next: null,
    previous: null
  }
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'pokemon' , idKey: 'name'})
export class PokemonStore extends EntityStore<PokemonState> {
  constructor() {
    super(initialState);
  }

  updatePaging(stateUi: any) {
    this.update({ ui:  stateUi} )
  }

}
