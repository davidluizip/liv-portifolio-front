import { Component, Input, OnInit } from '@angular/core';
import { filter, switchMap, take } from 'rxjs';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { MediaModel } from '../../models/media.model';
import { RegisterText } from '../../models/teacher-book.model';
import { RegisterService } from '../../services/api/register.service';
import { PageControllerService } from '../../services/page-controller.service';

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

  constructor(private registerContextService: RegisterContextService) {}

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
