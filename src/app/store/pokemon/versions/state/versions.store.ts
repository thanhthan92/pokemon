import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Version } from './version.model';

export interface VersionsState extends EntityState<Version> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'versions' , idKey: 'name'})
export class VersionsStore extends EntityStore<VersionsState> {

  constructor() {
    super();
  }

}
