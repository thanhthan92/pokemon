import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/content/content.component';
import { LayoutComponent } from './components/layout/layout.component';

import {MenubarModule} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    MenubarModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
  ]
})
export class LayoutModule { }
