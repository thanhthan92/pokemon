import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { GenerationStore, GenerationState } from './generation.store';

@Injectable({ providedIn: 'root' })
export class GenerationQuery extends QueryEntity<GenerationState> {

  constructor(protected store: GenerationStore) {
    super(store);
  }

}
