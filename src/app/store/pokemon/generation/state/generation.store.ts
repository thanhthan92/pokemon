import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Generation } from './generation.model';

export interface GenerationState extends EntityState<Generation> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'generation', idKey: 'name' })
export class GenerationStore extends EntityStore<GenerationState> {

  constructor() {
    super();
  }

}
