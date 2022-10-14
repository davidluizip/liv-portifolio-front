import { Injectable } from '@angular/core';
import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private hotToastService: HotToastService) {}

  success(message: string): CreateHotToastRef<unknown> {
    return this.hotToastService.success(message, {
      className: 'custom-toast-success'
    });
  }

  error(message: string): CreateHotToastRef<unknown> {
    return this.hotToastService.error(message, {
      className: 'custom-toast-error'
    });
  }

  info(message: string): CreateHotToastRef<unknown> {
    return this.hotToastService.info(message, {
      className: 'custom-toast-info'
    });
  }

  warn(message: string): CreateHotToastRef<unknown> {
    return this.hotToastService.warning(message, {
      className: 'custom-toast-warning'
    });
  }
}
