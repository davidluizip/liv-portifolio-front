import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { BookComponent } from './book.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [BookComponent],
  imports: [CommonModule, BookRoutingModule, AngularSvgIconModule],
})
export class BookModule {}
