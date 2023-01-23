import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, switchMap, tap } from 'rxjs';
import { EPages } from 'src/app/shared/enum/pages.enum';
import { MediaModel } from '../models/media.model';
import { Register } from '../models/teacher-book.model';
import { RegisterService } from './api/register.service';
import { PageControllerService } from './page-controller.service';
import {
  FieldContent,
  KeyFieldContent,
  RegisterContextService,
  RegisterField
} from './register-context.service';

export type RegisterData = Record<string, RegisterField>;

@Injectable({
  providedIn: 'root'
})
export class LessonTrackRegisterContextService {
  private _registers = new BehaviorSubject<RegisterData>({});
  registers$ = this._registers
    .asObservable()
    .pipe(tap((registers) => console.log('registers$', registers)));

  constructor(
    private pageControllerService: PageControllerService,
    private registerService: RegisterService,
    private registerContextService: RegisterContextService
  ) {}

  get snapshot() {
    return {
      registers: this._registers.getValue()
    };
  }

  private getLessonTrackRegisters(currentPage: number) {
    const { bookId } = this.pageControllerService.snapshot;

    return this.registerService
      .get(bookId, currentPage)
      .pipe(map(({ attributes }) => attributes));
  }

  listenRegisters(): void {
    this.pageControllerService.dynamicPreviousPage$
      .pipe(
        filter(({ indexPage, page }) => {
          const { currentPage } = this.pageControllerService.snapshot;

          return currentPage - 1 === indexPage && page === EPages.register;
        }),
        switchMap(({ indexPage }) => {
          return this.getLessonTrackRegisters(indexPage);
        })
      )
      .subscribe((data) => this.populateRegister(data.registros));

    this.pageControllerService.dynamicCurrentPage$
      .pipe(
        filter(({ indexPage, page }) => {
          const { currentPage } = this.pageControllerService.snapshot;

          return currentPage === indexPage && page === EPages.register;
        }),
        switchMap(({ indexPage }) => {
          return this.getLessonTrackRegisters(indexPage);
        })
      )
      .subscribe((data) => this.populateRegister(data.registros));
  }

  private populateRegister(register: Register) {
    const { currentPage } = this.pageControllerService.snapshot;

    if (register.texto?.length > 0) {
      register.texto.forEach((text) => {
        this.saveRegister(
          'text',
          {
            id: +text.alternativeText,
            midiaId: text.id,
            content: {
              about: text.descricao,
              name: text.nome
            }
          },
          currentPage
        );
      });
    }

    if (register.midia) {
      register.midia.forEach((media) => {
        const [type] = media.mime.split('/');
        this.setMedia(type, media, currentPage);
      });
    }
  }

  private saveRegister<Type extends KeyFieldContent>(
    type: Type,
    data: {
      id: number;
      midiaId: number;
      content: FieldContent[Type];
    },
    currentPage: number
  ) {
    const cachedRegister = this._registers.getValue() || {};

    const register: RegisterData = {
      ...cachedRegister,
      [currentPage]: {
        type,
        id: data.id,
        midiaId: data.midiaId,
        content: data.content
      }
    };

    this._registers.next(register);
  }

  private setMedia(type: string, midia: MediaModel, currentPage: number) {
    switch (type) {
      case 'audio':
        this.saveRegister(
          'audio',
          {
            id: +midia.alternativeText,
            midiaId: midia.id,
            content: {
              src: midia.url
            }
          },
          currentPage
        );
        break;
      case 'video':
        this.saveRegister(
          'video',
          {
            id: +midia.alternativeText,
            midiaId: midia.id,
            content: {
              src: midia.url,
              type
            }
          },
          currentPage
        );
        break;
      case 'image':
        this.saveRegister(
          'image',
          {
            id: +midia.alternativeText,
            midiaId: midia.id,
            content: {
              src: midia.url,
              alt: midia.caption
            }
          },
          currentPage
        );
        break;

      default:
        break;
    }
  }
}
