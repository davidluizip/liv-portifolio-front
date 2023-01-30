import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroductionComponent } from './pages/introduction/introduction.component';
import { ClassPageComponent } from './pages/class-page/class-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [IntroductionComponent, ClassPageComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  exports: [IntroductionComponent, ClassPageComponent]
})
export class IntroModule {}
