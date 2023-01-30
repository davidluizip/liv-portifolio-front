import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookComponent } from './book/book.component';
import { ShellRoutingModule } from './shell-routing.module';
import { LessonTrackModule } from '../modules/lesson-track/lesson-track.module';
import { SharedModule } from '../shared/shared.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { IntroModule } from '../modules/intro/intro.module';
import { RegisterModule } from '../modules/register/register.module';
import { CoverModule } from '../modules/cover/cover.module';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [BookComponent, FooterComponent],
  imports: [
    CommonModule,
    ShellRoutingModule,
    LessonTrackModule,
    IntroModule,
    RegisterModule,
    CoverModule,
    SharedModule,
    AngularSvgIconModule
  ]
})
export class ShellModule {}
