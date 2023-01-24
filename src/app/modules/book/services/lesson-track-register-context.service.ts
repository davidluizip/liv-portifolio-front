import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, switchMap, tap } from 'rxjs';
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

export type RegisterData = Record<string, RegisterField[]>;

@Injectable({
  providedIn: 'root'
})
export class LessonTrackRegisterContextService {
  private indexPage: number;
  private _registers = new BehaviorSubject<RegisterData>({});
  registers$ = this._registers.asObservable();

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

  private getLessonTrackRegisters() {
    const { bookId } = this.pageControllerService.snapshot;

    return this.registerService
      .get(bookId, this.indexPage)
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
          this.indexPage = indexPage;
          return this.getLessonTrackRegisters();
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
          this.indexPage = indexPage;
          return this.getLessonTrackRegisters();
        })
      )
      .subscribe((data) => this.populateRegister(data.registros));

    this.pageControllerService.pages$
      .pipe(
        filter(
          ({ previous, current }) =>
            !!(previous?.indexPage || current?.indexPage)
        ),
        tap(({ previous, current }) => {
          const { currentPage } = this.pageControllerService.snapshot;

          if (
            currentPage - 1 === previous.indexPage &&
            previous.page === EPages.register
          ) {
            this.indexPage = previous.indexPage;
          } else {
            this.indexPage = current.indexPage;
          }
        }),
        switchMap(() => this.registers$)
      )
      .pipe(filter((register) => !!register[this.indexPage]))
      .subscribe((register) => {
        this.registerContextService.resetAllFields();

        register[this.indexPage].forEach(({ content, id, midiaId, type }) => {
          this.registerContextService.setFieldValue(type, {
            content,
            id,
            midiaId
          });
        });
      });
  }

  private populateRegister(register: Register) {
    if (register.texto?.length > 0) {
      register.texto.forEach((text) => {
        this.saveRegister('text', {
          id: +text.alternativeText,
          midiaId: text.id,
          content: {
            about: text.descricao,
            name: text.nome
          }
        });
      });
    }

    if (register.midia) {
      register.midia.forEach((media) => {
        const [type] = media.mime.split('/');
        this.setMedia(type, media, this.indexPage);
      });
    }
  }

  private saveRegister<Type extends KeyFieldContent>(
    type: Type,
    data: {
      id: number;
      midiaId: number;
      content: FieldContent[Type];
    }
  ) {
    const cachedRegister = this._registers.getValue() || {};
    const alreadyPopulated = cachedRegister[this.indexPage]?.some(
      (register) => register.id === data.id
    );

    if (alreadyPopulated) {
      return;
    }

    const register: RegisterData = {
      ...cachedRegister,
      [this.indexPage]: [
        ...(cachedRegister[this.indexPage] ||= []),
        {
          type,
          id: data.id,
          midiaId: data.midiaId,
          content: data.content
        }
      ]
    };
    this._registers.next(register);
  }

  private setMedia(type: string, midia: MediaModel, currentPage: number) {
    switch (type) {
      case 'audio':
        this.saveRegister('audio', {
          id: +midia.alternativeText,
          midiaId: midia.id,
          content: {
            src: midia.url
          }
        });
        break;
      case 'video':
        this.saveRegister('video', {
          id: +midia.alternativeText,
          midiaId: midia.id,
          content: {
            src: midia.url,
            type
          }
        });
        break;
      case 'image':
        this.saveRegister('image', {
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
}
