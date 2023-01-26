import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs';

import {
  RegisterContextService,
  RegisterField
} from '../../services/register-context.service';

@Component({
  selector: 'liv-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Input() indexPage: number;

  readonly registerFields$ = this.registerContextService.registerFields$.pipe(
    map((registers) => registers.slice(0, 4))
  );

  constructor(private registerContextService: RegisterContextService) {}

  ngOnInit(): void {}

  handleOpenRegisterTypeModal(field: RegisterField): void {
    if (field.content) {
      return;
    }

    this.registerContextService.openRegisterTypeModal(field.id, this.indexPage);
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
