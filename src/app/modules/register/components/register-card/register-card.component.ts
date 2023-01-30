import { Component, Input } from '@angular/core';
import { LessonTrackContextService } from 'src/app/modules/lesson-track/services/lesson-track-context.service';
import { RegisterType } from '../../enums/register-type.enum';
import { LessonTrackRegisterContextService } from '../../services/lesson-track-register-context.service';
import { ProfessorAnalysisContextService } from '../../services/professor-analysis-context.service';

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

  constructor(
    private registerContextService: RegisterContextService,
    private professorAnalysisContextService: ProfessorAnalysisContextService,
    private lessonTrackRegisterContextService: LessonTrackRegisterContextService
  ) {}

  handleOpenRegisterTypeModal(field: RegisterField): void {
    if (field.content) {
      return;
    }

    const { currentRegisterPageType } =
      this.registerPageType === RegisterType.register
        ? this.lessonTrackRegisterContextService.snapshot
        : this.professorAnalysisContextService.snapshot;

    this.registerContextService.openRegisterTypeModal({
      fieldId: field.id,
      indexPage: this.indexPage,
      registerPageType: this.registerPageType,
      currentRegisterPageType
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
