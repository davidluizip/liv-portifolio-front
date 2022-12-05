import { Component } from '@angular/core';

import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'liv-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  readonly registerFields$ = this.registerService.registerFields$;

  constructor(private registerService: RegisterService) {}

  handleOpenRegisterTypeModal(fieldId: number) {
    this.registerService.openRegisterTypeModal(fieldId);
  }
}
