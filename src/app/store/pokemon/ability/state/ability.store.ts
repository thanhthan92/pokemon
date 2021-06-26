import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Ability } from './ability.model';

export interface AbilityState extends EntityState<Ability> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'ability' , idKey: 'name'})
export class AbilityStore extends EntityStore<AbilityState> {

  constructor() {
    super();
  }

}
