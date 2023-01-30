import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  Observable,
  pipe,
  switchMap,
  tap,
  UnaryFunction
} from 'rxjs';
import { EPages } from 'src/app/shared/enums/pages.enum';
import { FilterPagesConfig } from 'src/app/shared/interfaces/filter-pages-config';
import { PageControllerService } from 'src/app/shell/services/page-controller.service';
import { MediaModel } from '../../../shell/models/media.model';
import { RegisterModel } from '../../../shell/models/register.model';
import { Register } from '../../../shell/models/teacher-book.model';
import { RegisterService } from '../../register/services/api/register.service';
import {
  FieldContent,
  KeyFieldContent,
  RegisterContextService,
  RegisterField
} from '../../register/services/register-context.service';

export type RegisterData = Record<string, RegisterField[]>;

@Injectable({
  providedIn: 'root'
})
export class LessonTrackRegisterContextService {
  private indexPage: number;

  private _registers = new BehaviorSubject<RegisterData>({});
  public registers$ = this._registers.asObservable();

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

  private getRegisters(indexPage: number) {
    const { bookId } = this.pageControllerService.snapshot;

    return this.registerService.getRegisters(bookId, indexPage);
  }

  private listenRegisters(): void {
    this.pageControllerService.dynamicCurrentPage$
      .pipe(
        this.filterPagesConfig({
          variant: 'current'
        })
      )
      .subscribe(({ registros }) => {
        this.populateRegister(registros);
      });

    this.pageControllerService.dynamicPreviousPage$
      .pipe(
        this.filterPagesConfig({
          variant: 'previous'
        })
      )
      .subscribe(({ registros }) => {
        this.populateRegister(registros);
      });
  }

  private listenRegisterPagesAndSetValue() {
    this.pageControllerService.pages$
      .pipe(
        filter(
          ({ previous, current }) =>
            !!(previous?.indexPage || current?.indexPage) &&
            (previous.page === EPages.register ||
              current.page === EPages.register)
        ),
        tap(({ previous, current }) => {
          const { currentPage } = this.pageControllerService.snapshot;

          this.indexPage =
            currentPage === current.indexPage &&
            current.page === EPages.register
              ? current.indexPage
              : previous.indexPage;
        }),
        switchMap(() => this.registers$)
      )
      .pipe(
        tap(() => this.registerContextService.resetRegisterFields()),
        filter((register) => !!register[this.indexPage])
      )
      .subscribe((register) => {
        register[this.indexPage].forEach(({ content, id, midiaId, type }) => {
          this.registerContextService.setFieldRegisterValue(type, {
            content,
            id,
            midiaId
          });
        });
      });
  }

  listenEvents() {
    this.listenRegisters();
    this.listenRegisterPagesAndSetValue();
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
        this.setMedia(type, media);
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

  private setMedia(type: string, midia: MediaModel) {
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

  private filterPagesConfig({ variant }: FilterPagesConfig): UnaryFunction<
    Observable<{
      indexPage: number;
      page: EPages;
    }>,
    Observable<RegisterModel>
  > {
    return pipe(
      filter(({ indexPage, page }) => {
        const { currentPage } = this.pageControllerService.snapshot;

        let isCurrentPage = false;

        if (variant === 'previous') {
          isCurrentPage = currentPage - 1 === indexPage;
        } else {
          isCurrentPage = currentPage === indexPage;
        }

        return isCurrentPage && page === EPages.register;
      }),
      switchMap(({ indexPage }) => {
        this.indexPage = indexPage;

        return this.getRegisters(indexPage);
      }),
      filter(({ registros }) => !!registros)
    );
  }
}
