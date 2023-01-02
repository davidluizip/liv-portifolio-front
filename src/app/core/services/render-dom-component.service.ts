import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  Type,
  EmbeddedViewRef,
  ComponentFactoryResolver,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RenderDomComponentService<T = unknown> {
  private componentRef: ComponentRef<T> = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  appendComponentToBody(component: Type<T>, data?: Record<string, any>) {
    if (this.componentRef) this.removeComponentFromBody();

    this.componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);

    if (data)
      for (const key of Object.keys(data))
        this.componentRef.instance[key] = data[key];

    this.appRef.attachView(this.componentRef.hostView);

    // get DOM element from component
    const domElem = (this.componentRef.hostView as EmbeddedViewRef<T>)
      .rootNodes[0] as HTMLElement;

    this.document.body.appendChild(domElem);
  }

  removeComponentFromBody() {
    if (!this.componentRef) return;
    this.appRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();

    this.componentRef = null;
  }
}
