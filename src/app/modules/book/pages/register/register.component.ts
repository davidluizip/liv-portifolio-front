import { Component, OnInit } from '@angular/core';
import { filter, Observable, switchMap, take, tap } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { MediaModel } from '../../models/media.model';
import {
  RegisterText,
  TeacherBookModel,
} from '../../models/teacher-book.model';
import { RegisterService } from '../../services/api/register.service';
import { PageControllerService } from '../../services/page-controller.service';

import { RegisterContextService } from '../../services/register-context.service';

@Component({
  selector: 'liv-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  readonly registerFields$ = this.registerContextService.registerFields$;

  public registers$: Observable<Model<TeacherBookModel>>;

  constructor(
    private registerContextService: RegisterContextService,
    private pageControllerService: PageControllerService,
    private registerService: RegisterService
  ) {}

  ngOnInit(): void {
    this.getRegisters();
  }

  getRegisters(): void {
    this.pageControllerService.currentPage$
      .pipe(
        filter(page => EPages.register === page),
        switchMap(() =>
          this.registerService
            .get(this.pageControllerService.snapshot.bookId)
            .pipe(take(1))
        ),
        filter(({ attributes }) => !!attributes.registros)
      )
      .subscribe(({ attributes }) => {
        this.registerContextService.resetSelectedRegisterField();
        if (attributes.registros.texto?.length > 0) {
          this.populateTexts(attributes.registros.texto);
        }
        if (attributes.registros.midia?.data)
          this.populateMedias(attributes.registros.midia.data);
      });
  }

  populateTexts(texts: RegisterText[]) {
    for (const text of texts) {
      this.registerContextService.setFieldValue('text', {
        id: text.alternativeText,
        content: {
          about: text.descricao,
          name: text.nome,
        },
      });
    }
  }

  populateMedias(midias: Model<MediaModel>[]) {
    for (const midia of midias) {
      const [type] = midia.attributes.mime.split('/');
      this.setMedia(type, midia.attributes);
    }
  }

  setMedia(type: string, data: MediaModel) {
    switch (type) {
      case 'audio':
        this.registerContextService.setFieldValue('audio', {
          id: data.alternativeText,
          content: {
            src: data.url,
          },
        });
        break;
      case 'video':
        this.registerContextService.setFieldValue('video', {
          id: data.alternativeText,
          content: {
            src: data.url,
            type,
          },
        });
        break;
      case 'image':
        this.registerContextService.setFieldValue('image', {
          id: data.alternativeText,
          content: {
            src: data.url,
            alt: data.caption,
          },
        });
        break;

      default:
        break;
    }
  }

  handleOpenRegisterTypeModal(fieldId: number): void {
    this.registerContextService.openRegisterTypeModal(fieldId);
  }
}
