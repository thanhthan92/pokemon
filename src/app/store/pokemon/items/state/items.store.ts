import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Item } from './item.model';

export interface ItemsState extends EntityState<Item> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'items' , idKey: 'name'})
export class ItemsStore extends EntityStore<ItemsState> {

  constructor() {
    super();
  }

}
