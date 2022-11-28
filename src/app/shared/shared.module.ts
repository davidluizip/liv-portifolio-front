import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { IfLoadedDirective } from './directives/if-loaded.directive';
import { ImagePreloadDirective } from './directives/image-preload.directive';
import { OverlayDirective } from './directives/overlay.directive';
import { SafeTransformPipe } from './pipes/safe-tranform.pipe';
import { UploadMediaInputComponent } from './components/upload-media-input/upload-media-input.component';
import { DragDropFileUploadDirective } from './directives/drag-drop-file-upload.directive';

@NgModule({
  declarations: [
    OverlayDirective,
    ImagePreloadDirective,
    SafeTransformPipe,
    IfLoadedDirective,
    DragDropFileUploadDirective,
    UploadMediaInputComponent,
  ],
  imports: [CommonModule, AngularSvgIconModule],
  exports: [
    OverlayDirective,
    ImagePreloadDirective,
    SafeTransformPipe,
    IfLoadedDirective,
    DragDropFileUploadDirective,
    UploadMediaInputComponent,
  ],
  providers: [],
})
export class SharedModule {}
