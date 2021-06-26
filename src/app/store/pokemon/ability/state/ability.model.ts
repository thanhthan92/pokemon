export interface Ability {
  name?: number | string;
  effect_entries?: Effect;
  url?: string;
}
export interface common {
  name?: string,
  url?: string;
}

export interface Effect {
  effect?: string;
  language?: common;
  short_effect?: string;
}

export function createAbility(params: Partial<Ability>) {
  return {

  } as Ability;
}
