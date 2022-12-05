import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { BookComponent } from './book.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoverFrontBacksideComponent } from './components/cover-front-backside/cover-front-backside.component';
import { CoverFrontComponent } from './components/cover-front/cover-front.component';
import { RegisterComponent } from './pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterSelectModalComponent } from './pages/register/components/register-select-modal/register-select-modal.component';
import { StudentSpeechRecordModalComponent } from './pages/register/components/student-speech-record-modal/student-speech-record-modal.component';
import { RegisterBaseHeaderModalComponent } from './pages/register/components/register-base-header-modal/register-base-header-modal.component';
import { IntroductionComponent } from './components/introduction/introduction.component';

@NgModule({
  declarations: [
    BookComponent,
    CoverFrontBacksideComponent,
    CoverFrontComponent,
    IntroductionComponent,
    RegisterComponent,
    RegisterSelectModalComponent,
    StudentSpeechRecordModalComponent,
    RegisterBaseHeaderModalComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    BookRoutingModule,
    SharedModule,
    AngularSvgIconModule,
  ],
})
export class BookModule {}
