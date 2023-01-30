import { Component, Input } from '@angular/core';
import { distinctUntilChanged, map } from 'rxjs';
import { RegisterType } from '../../enums/register-type.enum';

import {
  RegisterContextService,
  RegisterField
} from '../../services/register-context.service';

@Component({
  selector: 'liv-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @Input() indexPage: number;

  public readonly registerFields$ =
    this.registerContextService.registerFields$.pipe(distinctUntilChanged());
  public readonly registerPageType = RegisterType.register;

  constructor(private registerContextService: RegisterContextService) {}

  handleRemoveRegister(event: Event, field: RegisterField): void {
    event.stopPropagation();

    this.registerContextService.removeRegisterField({
      type: field.type,
      midiaId: field.midiaId,
      fieldId: field.id
    });
  }
}
