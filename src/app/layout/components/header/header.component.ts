import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { combineLatest, Subject } from 'rxjs';
import { mergeMap, takeUntil, tap } from 'rxjs/operators';
import { GenerationQuery } from 'src/app/store/pokemon/generation/state/generation.query';
import { GenerationService } from 'src/app/store/pokemon/generation/state/generation.service';
import { PokemonQuery } from 'src/app/store/pokemon/state/pokemon.query';
import { VersionsQuery } from 'src/app/store/pokemon/versions/state/versions.query';
import { VersionsService } from 'src/app/store/pokemon/versions/state/versions.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  items: MenuItem[] = [];
  unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private generationQuery: GenerationQuery,
    private generationService: GenerationService,
    private versionService: VersionsService,
    private versionQuery: VersionsQuery) { }
  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        routerLink: '/pages/home'
      },
      {
        label: 'Games',
        items: [

        ]
      },
      {
        label: 'Generations',
        items: [
        ]
      },
      {
        label: 'Locations',
        items: [
        ]
      },
      {
        label: 'Items',
      },
    ];
    this.generationService.get().subscribe();
    this.versionService.get().subscribe();
    this.mappingMenu();
  }

  mappingMenu() {
    combineLatest([this.generationQuery.selectAll(), this.versionQuery.selectAll()]).pipe(
      tap(([generations, versions]) => {
        const _versions = [...[], ...versions];
        const _generations = [...[], ...generations];
        this.items.map(item => {
          switch (item?.label) {
            case "Games":
              item.items = _versions.map(version => {
                return {label: version.name};
              });
              break;
            case "Generations":
              item.items =_generations.map(generation => {
                return {label: generation.name};
              });;
              break;
            default:
              break;
          }
        })
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }



}
