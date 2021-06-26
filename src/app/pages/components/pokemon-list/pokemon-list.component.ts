import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FilterService } from 'primeng/api';
import { of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';
import { Effect } from 'src/app/store/pokemon/ability/state/ability.model';
import { AbilityQuery } from 'src/app/store/pokemon/ability/state/ability.query';
import { AbilityService } from 'src/app/store/pokemon/ability/state/ability.service';
import { Pokemon, QueryParams } from 'src/app/store/pokemon/state/pokemon.model';
import { PokemonQuery } from 'src/app/store/pokemon/state/pokemon.query';
import { PokemonService } from 'src/app/store/pokemon/state/pokemon.service';

interface Visable {
  name: string,
  code: number
}
@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit, OnDestroy {
  unsubscribeAll: Subject<any> = new Subject<any>();
  pokemons: Pokemon[] | any[] = [];
  pokemonSelected: Pokemon | any;
  display: boolean = false;
  visibles: Visable[] = [
    { name: '10', code: 10 },
    { name: '20', code: 20 },
    { name: '50', code: 50 },
    { name: '100', code: 100 },
  ];
  selectedVisible: Visable | any = { name: 20, code: 20 };
  row: number = 20;
  first: number | any = 0;
  totalRecords: number = 0;
  virtualPokemons: Pokemon[] = [];
  url: string = '';
  isLoading: boolean = false;
  @ViewChild('dv') dataview: any;
  constructor(private pokemonService: PokemonService,
    private pokemonQuery: PokemonQuery,
    private filterService: FilterService,
    private abilityService: AbilityService,
    private abilityQuery: AbilityQuery) { }

  ngOnInit(): void {
    this.pokemonService.clear();
    this.pokemonService.setLoading(true);
    this.pokemonQuery.selectLoading().pipe(takeUntil(this.unsubscribeAll)).subscribe(_isLoading => {
      this.isLoading = _isLoading;
    });

    this.pokemonQuery.select(state => state.ui).pipe(tap(rs => {
      this.url = (rs['next']) ? rs['next'] as string : '';
    })).subscribe();

    this.pokemonQuery.selectAll().pipe(
      tap(pokemons => {
        this.virtualPokemons = [...[], ...pokemons];
        this.totalRecords = this.virtualPokemons.length;
        this.pokemons = this.virtualPokemons.slice(this.first, (this.first + this.row));
      }),
    ).subscribe();
  }

  loadPokemons(queryParams: QueryParams = {}, isFirst: boolean = false, isRefresh: boolean = false) {

    return this.pokemonService.addStore(queryParams, isRefresh).pipe(
      takeUntil(this.unsubscribeAll),
      tap((pokemons: any) => {
        if (isFirst) {
          this.pokemons = pokemons.slice(0, this.row);
        }
        if (pokemons) {
          pokemons.forEach((pokemon: Pokemon) => {
            this.pokemonService.getDetail(pokemon?.name).subscribe();
          });
        }
      })
    )


  }

  visableOnchange(event: any) {
    this.row = event?.value?.code;
    this.loadPokemons({ limit: event?.value?.code * 2, offset: 0 }, true, true).subscribe();
    this.first = 0;
  }

  showDialog(pokemon: Pokemon) {
    if (pokemon) {
      this.pokemonSelected = pokemon;
      if(this.pokemonSelected?.abilities.length > 0) {
        this.pokemonSelected?.abilities.forEach((obj : any) => {
          this.abilityService.getDetail(obj?.ability?.name as string, obj?.ability?.url).pipe(takeUntil(this.unsubscribeAll)).subscribe();
        });
      }

      this.abilityQuery.selectAll().pipe(
        takeUntil(this.unsubscribeAll),
        tap((rs: any) => {
          if(this.pokemonSelected?.abilities.length > 0 && rs?.length > 0) {
            let abilities = [...[], ...this.pokemonSelected?.abilities];
            abilities = abilities.map((ability: any) => {
              const abilityInfo: any = rs.find((item: any) => item?.name === ability?.ability?.name);
              
              if(abilityInfo) {
                const desAbilityInfo: Effect = abilityInfo?.effect_entries.find((effect: Effect) => {
                    return effect.language?.name == 'en';
                })
                return {...{ability}, ...{desAbilityInfo: desAbilityInfo?.effect}};
              }
              return ability;
            });
            this.pokemonSelected = {...this.pokemonSelected, ...{abilities: abilities}};
          };
        })
      ).subscribe();
      
      this.display = true;
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
  }

  loadData(event: any) {
    const totalCurrent: number = this.pokemonQuery.getCount() ? this.pokemonQuery.getCount() : 0;
    const isFetchData = event.first != 0 && (totalCurrent - (event.first) >= event.rows) && this.first < event.first;
    this.first = event.first;
    if (isFetchData && this.url != '' || event.first == 0 && totalCurrent == 0) {

      this.loadPokemons({ limit: event.rows * 2, offset: (this.first === 0 ? totalCurrent : totalCurrent + event.rows * 2) }, false, false).pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe();
    }
    this.pokemons = this.virtualPokemons.slice(event.first, (event.first + event.rows));

  }

  filter(event: any) {
    if (this.dataview) {
      //this.dataview.filterService.filters(event['data']);
      this.pokemons = this.filterService.filter(this.virtualPokemons, ['name'], event['data'], 'contains');
    }
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}
