import { Component, OnInit } from '@angular/core';
import { filter, map, Observable, switchMap, take, tap } from 'rxjs';
import { Model } from 'src/app/core/models/liv-response-protocol.model';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { MediaModel } from '../../models/media.model';
import {
  RegisterText,
  TeacherBookModel
} from '../../models/teacher-book.model';
import { RegisterService } from '../../services/api/register.service';
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
  readonly registerFields$ = this.registerContextService.registerFields$.pipe(
    map(registers => registers.slice(0,4)));

  constructor(
    private registerContextService: RegisterContextService,
    private pageControllerService: PageControllerService,
    private registerService: RegisterService
  ) {}

  ngOnInit(): void {
    this.getRegisters();
  }

  getRegisters(): void {
    this.pageControllerService.dynamicCurrentPage$
      .pipe(
        filter(current => current?.page === EPages.register),
        switchMap(() =>
          this.registerService
            .get(this.pageControllerService.snapshot.bookId)
            .pipe(take(1))
        ),
        filter(({ attributes }) => !!attributes.registros)
      )
      .subscribe(({ attributes }) => {
        if (attributes.registros.texto?.length > 0) {
          this.populateTexts(attributes.registros.texto);
        }
        if (attributes.registros.midia?.data) {
          this.populateMedias(attributes.registros.midia.data);
        }
      });
    this.pageControllerService.dynamicPreviousPage$
      .pipe(
        filter(previous => previous?.page === EPages.register),
        switchMap(() =>
          this.registerService
            .get(this.pageControllerService.snapshot.bookId)
            .pipe(take(1))
        ),
        filter(({ attributes }) => !!attributes.registros)
      )
      .subscribe(({ attributes }) => {
        if (attributes.registros.texto?.length > 0) {
          this.populateTexts(attributes.registros.texto);
        }
        if (attributes.registros.midia?.data) {
          this.populateMedias(attributes.registros.midia.data);
        }
      });
  }

  populateTexts(texts: RegisterText[]) {
    for (const text of texts) {
      this.registerContextService.setFieldValue('text', {
        id: text.alternativeText,
        midiaId: text.id,
        content: {
          about: text.descricao,
          name: text.nome
        }
      });
    }
  }

  populateMedias(midias: Model<MediaModel>[]) {
    for (const midia of midias) {
      const [type] = midia.attributes.mime.split('/');
      this.setMedia(type, midia);
    }
  }

  setMedia(type: string, midia: Model<MediaModel>) {
    const { id, attributes } = midia;
    switch (type) {
      case 'audio':
        this.registerContextService.setFieldValue('audio', {
          id: +attributes.alternativeText,
          midiaId: id,
          content: {
            src: attributes.url
          }
        });
        break;
      case 'video':
        this.registerContextService.setFieldValue('video', {
          id: +attributes.alternativeText,
          midiaId: id,
          content: {
            src: attributes.url,
            type
          }
        });
        break;
      case 'image':
        this.registerContextService.setFieldValue('image', {
          id: +attributes.alternativeText,
          midiaId: id,
          content: {
            src: attributes.url,
            alt: attributes.caption
          }
        });
        break;

      default:
        break;
    }
  }

  handleOpenRegisterTypeModal(field: RegisterField): void {
    if (field.content) {
      return;
    }

    this.registerContextService.openRegisterTypeModal(field.id);
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
