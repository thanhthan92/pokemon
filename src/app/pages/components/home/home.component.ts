import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { mapTo, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { Ability, Effect } from 'src/app/store/pokemon/ability/state/ability.model';
import { AbilityQuery } from 'src/app/store/pokemon/ability/state/ability.query';
import { AbilityService } from 'src/app/store/pokemon/ability/state/ability.service';
import { Item } from 'src/app/store/pokemon/items/state/item.model';
import { ItemsQuery } from 'src/app/store/pokemon/items/state/items.query';
import { ItemsService } from 'src/app/store/pokemon/items/state/items.service';
import { Pokemon } from 'src/app/store/pokemon/state/pokemon.model';
import { PokemonQuery } from 'src/app/store/pokemon/state/pokemon.query';
import { PokemonService } from 'src/app/store/pokemon/state/pokemon.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  unsubscribeAll: Subject<any> = new Subject();
  pokemons: Pokemon[] | any;
  items: Item[] | any;
  display: boolean = false;
  pokemonSelected: Pokemon | any = {};
  isLoadingDataModel: Observable<boolean> = of(false);

  constructor(private _sanitizer: DomSanitizer,
    private pokemonService: PokemonService,
    private pokemonQuery: PokemonQuery,
    private itemsService: ItemsService,
    private itemQuery: ItemsQuery,
    private router: Router,
    private abilityService: AbilityService,
    private abilityQuery: AbilityQuery
    ) {
  }
  images: object[] = [
    {
      "previewVideoSrc": "https://www.youtube.com/embed/D0zYJ1RQ-fs",
      "previewImageSrc": "https://www.primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria1s.jpg",
      "thumbnailImageSrc": "https://www.primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria1s.jpg",
      "alt": "Description for Image 1",
      "title": "Title 1"
    },
    {
      "previewVideoSrc": "https://www.youtube.com/embed/1roy4o4tqQM",
      "previewImageSrc": "https://www.primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria1s.jpg",
      "thumbnailImageSrc": "https://www.primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria2s.jpg",
      "alt": "Description for Image 2",
      "title": "Title 2"
    },
    {
      "previewVideoSrc": "https://www.youtube.com/embed/bILE5BEyhdo",
      "previewImageSrc": "https://www.primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria3s.jpg",
      "thumbnailImageSrc": "https://www.primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria3s.jpg",
      "alt": "Description for Image 3",
      "title": "Title 3"
    },
    {
      "previewVideoSrc": "https://www.youtube.com/embed/uBYORdr_TY8",
      "previewImageSrc": "https://www.primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria5s.jpg",
      "thumbnailImageSrc": "https://www.primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria5s.jpg",
      "alt": "Description for Image 5",
      "title": "Title 5"
    }
  ]

  ngOnInit(): void {
    this.isLoadingDataModel = this.abilityQuery.selectLoading();
    this.images = this.images.map((image: any) => {
      return { ...image, ...{ previewVideoSrc: this._sanitizer.bypassSecurityTrustResourceUrl(image["previewVideoSrc"]) } }
    })
    this.loadPokemons();
    this.loadItems();
  }

  loadItems() {
    this.itemsService.get({ limit: 10, offset: 0 }).pipe(
      takeUntil(this.unsubscribeAll),
      tap((items: any) => {
        items.forEach((item: Item) => {
          this.itemsService.getDetail(item?.name).subscribe();
        });
      })
    ).subscribe();

    this.itemQuery.selectAll().pipe(
      tap(items => {
        this.items = [...[], ...items];
      }),
    ).subscribe();
  }

  loadPokemons() {
    this.pokemonService.addStore({ limit: 10, offset: 0 }, true).pipe(
      takeUntil(this.unsubscribeAll),
      tap((pokemons: any) => {
        if(pokemons) {
          pokemons.forEach((pokemon: Pokemon) => {
            this.pokemonService.getDetail(pokemon?.name).subscribe();
          });
        }
      })
    ).subscribe();

    this.pokemonQuery.selectAll().pipe(
      tap(pokemons => {
        this.pokemons = [...[], ...pokemons];
      }),
    ).subscribe();
  }

  showDialog(pokemon: Pokemon) {
    if (pokemon) {
      this.pokemonSelected = pokemon;
      if(this.pokemonSelected?.abilities.length > 0) {
        this.pokemonSelected?.abilities.forEach((obj : any) => {
          this.abilityService.setLoading(true);
          this.abilityService.getDetail(obj?.ability?.name as string, obj?.ability?.url).pipe(takeUntil(this.unsubscribeAll)).subscribe();
        });
      }

      this.abilityQuery.selectAll().pipe(
        takeUntil(this.unsubscribeAll),
        tap(rs => {
          if(this.pokemonSelected?.abilities.length > 0 && rs?.length > 0) {
            let abilities = [...[], ...this.pokemonSelected?.abilities];
            abilities = abilities.map((ability: any) => {
              const abilityInfo: any = rs.find(item => item?.name === ability?.ability?.name);
              
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

  showListPokemon() {
    this.router.navigate(['/pages/list']);
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}
