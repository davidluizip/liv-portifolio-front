import { Component, Input, OnInit } from '@angular/core';
import { filter, map, switchMap, take, tap } from 'rxjs';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { MediaModel } from '../../models/media.model';
import { RegisterText } from '../../models/teacher-book.model';
import { RegisterService } from '../../services/api/register.service';
import { LessonTrackRegisterContextService } from '../../services/lesson-track-register-context.service';
import { PageControllerService } from '../../services/page-controller.service';

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
  indexCurrent = false;
  // readonly registerFields$ =
  //   this.lessonTrackRegisterContextService.registers$.pipe(
  //     tap((data) => console.log(data[this.indexPage])),
  //     filter((data) => !!data[this.indexPage]),
  //     tap((data) => {
  //       this.indexCurrent = true;
  //       const { id, midiaId, type, content } = data[this.indexPage];
  //       this.registerContextService.setFieldValue(type, {
  //         content,
  //         id,
  //         midiaId
  //       });
  //     }),
  //     switchMap(() => {
  //       return this.registerContextService.registerFields$;
  //     })
  //   );

  readonly registerFields$ = this.registerContextService.registerFields$;
  @Input() indexPage: number;

  constructor(
    private registerContextService: RegisterContextService,
    private lessonTrackRegisterContextService: LessonTrackRegisterContextService
  ) {}

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
