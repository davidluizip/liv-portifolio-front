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
export class RegisterCardComponent implements OnInit {
  @Input() field: RegisterField;
  @Input() indexPage: number;

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
        filter((current) => current?.page === EPages.register),
        switchMap(() =>
          this.registerService
            .get(
              this.pageControllerService.snapshot.bookId,
              this.pageControllerService.snapshot.currentPage
            )
            .pipe(take(1))
        ),
        filter(({ attributes }) => !!attributes.registros)
      )
      .subscribe(({ attributes }) => {
        if (attributes.registros.texto?.length > 0) {
          this.populateTexts(attributes.registros.texto);
        }
        if (attributes.registros.midia) {
          this.populateMedias(attributes.registros.midia);
        }
      });
    this.pageControllerService.dynamicPreviousPage$
      .pipe(
        filter((previous) => previous?.page === EPages.register),
        switchMap(() =>
          this.registerService
            .get(
              this.pageControllerService.snapshot.bookId,
              this.pageControllerService.snapshot.currentPage
            )
            .pipe(take(1))
        ),
        filter(({ attributes }) => !!attributes.registros)
      )
      .subscribe(({ attributes }) => {
        if (attributes.registros.texto?.length > 0) {
          this.populateTexts(attributes.registros.texto);
        }
        if (attributes.registros.midia) {
          this.populateMedias(attributes.registros.midia);
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

  populateMedias(midias: MediaModel[]) {
    for (const midia of midias) {
      const [type] = midia.mime.split('/');
      this.setMedia(type, midia);
    }
  }

  setMedia(type: string, midia: MediaModel) {
    switch (type) {
      case 'audio':
        this.registerContextService.setFieldValue('audio', {
          id: +midia.alternativeText,
          midiaId: midia.id,
          content: {
            src: midia.url
          }
        });
        break;
      case 'video':
        this.registerContextService.setFieldValue('video', {
          id: +midia.alternativeText,
          midiaId: midia.id,
          content: {
            src: midia.url,
            type
          }
        });
        break;
      case 'image':
        this.registerContextService.setFieldValue('image', {
          id: +midia.alternativeText,
          midiaId: midia.id,
          content: {
            src: midia.url,
            alt: midia.caption
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

