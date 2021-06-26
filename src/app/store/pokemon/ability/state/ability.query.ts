import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { AbilityStore, AbilityState } from './ability.store';

@Injectable({ providedIn: 'root' })
export class AbilityQuery extends QueryEntity<AbilityState> {

  constructor(protected store: AbilityStore) {
    super(store);
  }

}
