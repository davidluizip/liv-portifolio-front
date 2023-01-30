import { Component, Input } from '@angular/core';
import { RegisterType } from '../../enums/register-type.enum';

import {
  RegisterContextService,
  RegisterField
} from '../../services/register-context.service';

@Component({
  selector: 'liv-register-card',
  templateUrl: './register-card.component.html',
  styleUrls: ['./register-card.component.scss']
})
export class RegisterCardComponent {
  @Input() field: RegisterField;
  @Input() indexPage: number;
  @Input() registerPageType: RegisterType;

  constructor(private registerContextService: RegisterContextService) {}

  handleOpenRegisterTypeModal(field: RegisterField): void {
    if (field.content) {
      return;
    }

    this.registerContextService.openRegisterTypeModal({
      fieldId: field.id,
      indexPage: this.indexPage,
      registerPageType: this.registerPageType
    });
  }

  handleRemoveRegister(event: Event, field: RegisterField): void {
    event.stopPropagation();
    this.registerContextService.removeRegisterField({
      type: field.type,
      midiaId: field.midiaId,
      fieldId: field.id
    });
  }
}
