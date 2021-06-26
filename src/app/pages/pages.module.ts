import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './components/home/home.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PagesComponent } from './components/pages/pages.component';
import { GalleriaModule } from 'primeng/galleria';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import {PaginatorModule} from 'primeng/paginator';
import {InputTextModule} from 'primeng/inputtext';


@NgModule({
  declarations: [
    HomeComponent,
    PokemonListComponent,
    PagesComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    GalleriaModule,
    DataViewModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    PaginatorModule,
    InputTextModule
  ]
})
export class PagesModule { }
