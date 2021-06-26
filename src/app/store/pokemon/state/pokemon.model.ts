
export interface Pokemon {
  name?:string | any;
  url?: string;
  sprites?:object;
  next?:string;
  previous?:string;
  count?: number;
}

export interface QueryParams {
  offset?: number;
  limit?: number;
}

export function createPokemon(params: Partial<Pokemon>) {
  return {

  } as Pokemon;
}
