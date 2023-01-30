import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoverFrontComponent } from './pages/cover-front/cover-front.component';
import { CoverBackComponent } from './pages/cover-back/cover-back.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CoverFrontComponent, CoverBackComponent],
  imports: [CommonModule, SharedModule],
  exports: [CoverFrontComponent, CoverBackComponent]
})
export class CoverModule {}
