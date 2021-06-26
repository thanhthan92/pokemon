import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FilterService } from 'primeng/api';
import { of, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Pokemon, QueryParams } from 'src/app/store/pokemon/state/pokemon.model';
import { PokemonQuery } from 'src/app/store/pokemon/state/pokemon.query';
import { PokemonService } from 'src/app/store/pokemon/state/pokemon.service';
import Observable from 'zen-observable';
interface Visable {
  name: string,
  code: number
}
@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit, OnDestroy{
  unsubscribeAll: Subject<any> = new Subject<any>();
  pokemons: Pokemon[] | any[]  = [];
  pokemonSelected: Pokemon | any;
  display: boolean = false;
  visibles: Visable[] = [
    {name: '10', code: 10},
    {name: '20', code: 20},
    {name: '50', code: 50},
    {name: '100', code: 100},
  ];
  selectedVisible: Visable | any = {name: 20, code: 20};
  row: number = 20;
  first: number | any = 0;
  totalRecords: number = 0;
  virtualPokemons: Pokemon[] = [];
  url:string = '';
  isLoading: boolean = false;
  @ViewChild('dv') dataview: any;
  constructor(private pokemonService: PokemonService,
    private pokemonQuery: PokemonQuery,
    private filterService: FilterService) { }

  ngOnInit(): void {
    this.pokemonQuery.selectLoading().pipe(takeUntil(this.unsubscribeAll)).subscribe(_isLoading => {
      this.isLoading = _isLoading;
    });
    this.loadPokemons({limit: 100, offset: 0}, true,false);

    this.pokemonQuery.select(state => state.ui).pipe(tap(rs => {
      const totalCurrent: number = this.pokemonQuery.getCount() ? this.pokemonQuery.getCount() : 0;
      const total: number = rs && rs['count'] ? rs['count'] : 0;
      this.totalRecords = total;
      if(rs['next'] && total > 0 &&  total > totalCurrent) {
       this.url = rs['next'] as string;
      }
    })).subscribe()
  }

  loadPokemons(queryParams: QueryParams = {}, isFirst: boolean = false,isRefresh: boolean = false, url: string = '') {
    this.pokemonService.addStore(queryParams, url, isRefresh).pipe(
      takeUntil(this.unsubscribeAll),
      tap((pokemons: any) => {
        if(isFirst) {
          this.pokemons = pokemons.slice(0, this.row * 2);
        }
        if(pokemons) {
          pokemons.forEach((pokemon: Pokemon) => {
            this.pokemonService.getDetail(pokemon?.name).subscribe();
          });
        }
      })
    ).subscribe();

    this.pokemonQuery.selectAll().pipe(
      tap(pokemons => {
        this.virtualPokemons = [...[], ...pokemons];
        console.log(this.virtualPokemons, this.first);
        this.pokemons = this.virtualPokemons.slice(this.first, (this.first + this.row * 2));
      }),
    ).subscribe();
  }

  visableOnchange(event: any) {
    this.row = event?.value?.code;
    this.loadPokemons({limit: event?.value?.code * 2, offset: 0}, false, true);
    this.first = 0;
  }

  showDialog(pokemon: Pokemon) {
    if (pokemon) {
      this.pokemonSelected = pokemon;
      this.display = true;
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
  }

  loadData(event: any) {
    this.first = event.first;
    const totalCurrent: number = this.pokemonQuery.getCount() ? this.pokemonQuery.getCount() : 0;
    if((event.first + this.row) >= totalCurrent && this.url != '') {
      this.loadPokemons({}, false,false,this.url);
    }
    this.pokemons = this.virtualPokemons.slice(event.first, (event.first + event.rows * 2));
    
  }

  filter(event: any) {
    if(this.dataview) {
      //this.dataview.filterService.filters(event['data']);
      this.pokemons = this.filterService.filter(this.virtualPokemons, ['name'], event['data'], 'contains');
    }
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}
