import { Injectable } from '@angular/core';
import {
  CreateHotToastRef,
  HotToastService,
  ToastOptions,
} from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly options: Partial<ToastOptions<unknown>> = {
    position: 'bottom-right',
    duration: 3000,
  };

  constructor(private hotToastService: HotToastService) {}

  success(message: string, options = this.options): CreateHotToastRef<unknown> {
    return this.hotToastService.success(message, {
      className: 'custom-toast-success',
      ...options,
    });
  }

  error(message: string, options = this.options): CreateHotToastRef<unknown> {
    return this.hotToastService.error(message, {
      className: 'custom-toast-error',
      ...options,
    });
  }

  info(message: string, options = this.options): CreateHotToastRef<unknown> {
    return this.hotToastService.info(message, {
      className: 'custom-toast-info',
      ...options,
    });
  }

  warn(message: string, options = this.options): CreateHotToastRef<unknown> {
    return this.hotToastService.warning(message, {
      className: 'custom-toast-warning',
      ...options,
    });
  }
}
