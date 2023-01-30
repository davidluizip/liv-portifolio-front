import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'liv-register-base-header-modal',
  templateUrl: './register-base-header-modal.component.html',
  styleUrls: ['./register-base-header-modal.component.scss'],
})
export class RegisterBaseHeaderModalComponent {
  @Input() title = 'Modal';
  @Output() close = new EventEmitter();

  public showHelpButton = false;

  onClose() {
    this.close.emit();
  }
}
