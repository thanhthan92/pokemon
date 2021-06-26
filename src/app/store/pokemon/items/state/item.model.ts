export interface Item {
  name?:string | any;
  url?: string;
  sprites?:object;
}

export function createItem(params: Partial<Item>) {
  return {

  } as Item;
}
