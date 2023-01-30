import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonTrackRegisterComponent } from './pages/lesson-track-register/lesson-track-register.component';
import { LessonTrackComponent } from './pages/lesson-track/lesson-track.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [LessonTrackRegisterComponent, LessonTrackComponent],
  imports: [CommonModule, SharedModule],
  exports: [LessonTrackRegisterComponent, LessonTrackComponent]
})
export class LessonTrackModule {}
