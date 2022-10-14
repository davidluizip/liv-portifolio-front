import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { IfLoadedDirective } from './directives/if-loaded.directive';
import { ImagePreloadDirective } from './directives/image-preload.directive';
import { OverlayDirective } from './directives/overlay.directive';
import { SafeTransformPipe } from './pipes/safe-tranform.pipe';

@NgModule({
  declarations: [
    OverlayDirective,
    ImagePreloadDirective,
    SafeTransformPipe,
    IfLoadedDirective,
  ],
  imports: [CommonModule, AngularSvgIconModule],
  exports: [
    OverlayDirective,
    ImagePreloadDirective,
    SafeTransformPipe,
    IfLoadedDirective,
  ],
  providers: [],
})
export class SharedModule {}
