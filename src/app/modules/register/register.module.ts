import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterSelectModalComponent } from './components/register-select-modal/register-select-modal.component';
import { StudentSpeechRecordModalComponent } from './components/student-speech-record-modal/student-speech-record-modal.component';
import { RegisterBaseHeaderModalComponent } from './components/register-base-header-modal/register-base-header-modal.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { RegisterCardComponent } from './components/register-card/register-card.component';
import { RegisterAnalysisComponent } from './pages/register-analysis/register-analysis.component';
import { ProfessorAnalysisModalComponent } from './components/professor-analysis-modal/professor-analysis-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RegisterSelectModalComponent,
    StudentSpeechRecordModalComponent,
    RegisterBaseHeaderModalComponent,
    AudioPlayerComponent,
    VideoPlayerComponent,
    RegisterCardComponent,
    RegisterComponent,
    RegisterAnalysisComponent,
    ProfessorAnalysisModalComponent
  ],
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  exports: [RegisterComponent, RegisterAnalysisComponent]
})
export class RegisterModule {}
