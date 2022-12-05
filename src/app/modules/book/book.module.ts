import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { BookComponent } from './book.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoverFrontBacksideComponent } from './components/cover-front-backside/cover-front-backside.component';
import { CoverFrontComponent } from './components/cover-front/cover-front.component';
import { IntroductionComponent } from './components/introduction/introduction.component';

@NgModule({
  declarations: [BookComponent, CoverFrontBacksideComponent, CoverFrontComponent, IntroductionComponent],
  imports: [
    CommonModule,
    BookRoutingModule,
    SharedModule,
    AngularSvgIconModule,
  ],
})
export class BookModule {}
