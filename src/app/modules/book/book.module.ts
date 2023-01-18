import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { BookComponent } from './book.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoverFrontBacksideComponent } from './pages/static/cover-front-backside/cover-front-backside.component';
import { CoverFrontComponent } from './pages/static/cover-front/cover-front.component';
import { RegisterComponent } from './pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterSelectModalComponent } from './pages/register/components/register-select-modal/register-select-modal.component';
import { StudentSpeechRecordModalComponent } from './pages/register/components/student-speech-record-modal/student-speech-record-modal.component';
import { RegisterBaseHeaderModalComponent } from './pages/register/components/register-base-header-modal/register-base-header-modal.component';
import { IntroductionComponent } from './pages/introduction/introduction.component';
import { TitleBadgeComponent } from './components/title-badge/title-badge.component';
import { LessonTrackRegisterComponent } from './pages/lesson-track-register/lesson-track-register.component';
import { LessonTrackComponent } from './pages/lesson-track/lesson-track.component';
import { AudioPlayerComponent } from './pages/register/components/audio-player/audio-player.component';
import { VideoPlayerComponent } from './pages/register/components/video-player/video-player.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfessorAnalisysComponent } from './components/professor-analisys/professor-analisys.component';

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
    LessonTrackRegisterComponent,
    LessonTrackComponent,
    TitleBadgeComponent,
    AudioPlayerComponent,
    VideoPlayerComponent,
    FooterComponent,
    ProfessorAnalisysComponent,
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
