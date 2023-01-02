import { Injectable } from '@angular/core';
import { RenderDomComponentService } from 'src/app/core/services/render-dom-component.service';
import { LoadingOverlayComponent } from './loading-overlay.component';

@Injectable({
  providedIn: 'root',
})
export class LoadingOverlayService {
  constructor(
    private renderDomComponentService: RenderDomComponentService<LoadingOverlayComponent>
  ) {}

  open(title?: string): void {
    this.renderDomComponentService.appendComponentToBody(
      LoadingOverlayComponent,
      { title }
    );
  }

  remove(): void {
    this.renderDomComponentService.removeComponentFromBody();
  }
}
