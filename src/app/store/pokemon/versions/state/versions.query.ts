import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { VersionsStore, VersionsState } from './versions.store';

@Injectable({ providedIn: 'root' })
export class VersionsQuery extends QueryEntity<VersionsState> {

  constructor(protected store: VersionsStore) {
    super(store);
  }

}
