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
import { FilterPagesConfig } from '../../../shared/interfaces/filter-pages-config';

import {
  FieldContent,
  KeyFieldContent,
  RegisterContextService,
  RegisterField
} from './register-context.service';
import { RegisterData } from './lesson-track-register-context.service';

import { PageControllerService } from 'src/app/shell/services/page-controller.service';
import { RegisterService } from './api/register.service';
import { Register } from '../../../shell/models/teacher-book.model';
import { MediaModel } from '../../../shell/models/media.model';
import { RegisterModel } from '../../../shell/models/register.model';
import { CurrentRegisterPageType } from '../enums/register-type.enum';

interface RegisterAnalysisData {
  registers: RegisterField[];
  analyse: string;
}

type RegisterAnalysis = Record<string, RegisterAnalysisData>;

@Injectable({
  providedIn: 'root'
})
export class ProfessorAnalysisContextService {
  public indexPage: number;

  private registers: RegisterData = {};

  private currentRegisterPageType: CurrentRegisterPageType;

  private _registerAnalysis = new BehaviorSubject<RegisterAnalysis>({});
  public registerAnalysis$ = this._registerAnalysis.asObservable();

  constructor(
    private pageControllerService: PageControllerService,
    private registerService: RegisterService,
    private registerContextService: RegisterContextService
  ) {}

  private getAnalysisRegisters(indexPage: number) {
    const { bookId } = this.pageControllerService.snapshot;

    return this.registerService.getRegisters(bookId, indexPage);
  }

  get snapshot() {
    return {
      currentRegisterPageType: this.currentRegisterPageType
    };
  }

  private listenAnalysis(): void {
    this.pageControllerService.dynamicPreviousPage$
      .pipe(
        this.filterPagesConfig({
          variant: 'previous'
        })
      )
      .subscribe(({ registros }) =>
        this.saveProfessorAnalysisFields(registros)
      );

    this.pageControllerService.dynamicCurrentPage$
      .pipe(
        this.filterPagesConfig({
          variant: 'current'
        })
      )
      .subscribe(({ registros }) =>
        this.saveProfessorAnalysisFields(registros)
      );
  }

  public listenEvents() {
    this.listenAnalysis();
    this.listenPagesAndSetValue();
  }

  // eslint-disable-next-line max-lines-per-function
  private listenPagesAndSetValue() {
    this.pageControllerService.pages$
      .pipe(
        filter(
          ({ previous, current }) =>
            !!(previous?.indexPage || current?.indexPage) &&
            (previous.page === EPages.register_analysis ||
              current.page === EPages.register_analysis)
        ),
        tap(({ previous, current }) => {
          const { currentPage } = this.pageControllerService.snapshot;

          if (
            currentPage === current.indexPage &&
            current.page === EPages.register_analysis
          ) {
            this.indexPage = current.indexPage;

            this.currentRegisterPageType = CurrentRegisterPageType.current;
          } else {
            this.indexPage = previous.indexPage;
            this.currentRegisterPageType = CurrentRegisterPageType.previous;
          }
        }),
        switchMap(() => this.registerAnalysis$)
      )
      .pipe(
        tap(() => {
          this.registerContextService.resetProfessorAnalysisFields(
            this.currentRegisterPageType,
            this.indexPage
          );
        }),
        filter((registerAnalysis) => !!registerAnalysis[this.indexPage])
      )
      .subscribe((registerAnalysis) => {
        const analyse = registerAnalysis[this.indexPage].analyse;

        this.registerContextService.setProfessorAnalyse({
          analyse,
          currentRegisterPageType: this.currentRegisterPageType,
          indexPage: this.indexPage
        });

        registerAnalysis[this.indexPage].registers?.forEach(
          ({ content, id, midiaId, type }) => {
            this.registerContextService.setProfessorRegisterAnalysisValue({
              currentRegisterPageType: this.currentRegisterPageType,
              indexPage: this.indexPage,
              field: {
                type,
                data: {
                  content,
                  id,
                  midiaId
                }
              }
            });
          }
        );
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
    const cachedRegister = this.registers || {};
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
    this.registers = register;
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

  private saveProfessorAnalysisFields(register: Register) {
    this.populateRegister(register);

    const cachedRegisterAnalysis = this._registerAnalysis.getValue();

    const registerAnalysis: RegisterAnalysis = {
      ...cachedRegisterAnalysis,
      [this.indexPage]: {
        registers: this.registers[this.indexPage],
        analyse: register.analise_registro
      }
    };

    this._registerAnalysis.next(registerAnalysis);
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

        return isCurrentPage && page === EPages.register_analysis;
      }),
      switchMap(({ indexPage }) => {
        this.indexPage = indexPage;

        return this.getAnalysisRegisters(indexPage);
      }),
      filter(({ registros }) => !!registros)
    );
  }
}
