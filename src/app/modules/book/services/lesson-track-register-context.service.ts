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

interface RegisterAnalysis {
  content: string;
}

export type RegisterData = Record<string, RegisterField[]>;
export type RegisterAnalysisData = Record<string, RegisterAnalysis>;

@Injectable({
  providedIn: 'root'
})
export class LessonTrackRegisterContextService {
  private indexRegisterPage: number;
  private indexRegisterAnalysisPage: number;

  private _registers = new BehaviorSubject<RegisterData>({});
  public registers$ = this._registers.asObservable();

  private _registerAnalysis = new BehaviorSubject<RegisterAnalysisData>({});
  public registerAnalysis$ = this._registerAnalysis.asObservable();

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

    return this.registerService.getRegisters(bookId, this.indexRegisterPage);
  }

  private getAnalysisRegister() {
    const { bookId } = this.pageControllerService.snapshot;

    return this.registerService.getTeacherAnalysis(
      bookId,
      this.indexRegisterAnalysisPage
    );
  }

  listenRegistersAndAnalysis(): void {
    this.pageControllerService.dynamicPreviousPage$
      .pipe(
        filter(({ indexPage, page }) => {
          const { currentPage } = this.pageControllerService.snapshot;

          const currentIndexPage = currentPage - 1 === indexPage;

          return (
            (currentIndexPage && page === EPages.register) ||
            (currentIndexPage && page === EPages.register_analysis)
          );
        }),
        switchMap(({ indexPage, page }) => {
          if (page === EPages.register_analysis) {
            this.indexRegisterAnalysisPage = indexPage;

            return this.getAnalysisRegister().pipe(
              tap(({ analise_registro }) => {
                const cachedRegisterAnalysis =
                  this._registerAnalysis.getValue();

                const registerAnalysis = {
                  ...cachedRegisterAnalysis,
                  [indexPage]: {
                    content: analise_registro
                  }
                };

                this._registerAnalysis.next(registerAnalysis);
              })
            );
          }

          this.indexRegisterPage = indexPage;

          return this.getLessonTrackRegisters().pipe(
            tap(({ registros }) => this.populateRegister(registros))
          );
        })
      )
      .subscribe();

    this.pageControllerService.dynamicCurrentPage$
      .pipe(
        filter(({ indexPage, page }) => {
          const { currentPage } = this.pageControllerService.snapshot;

          const currentIndexPage = currentPage === indexPage;

          return (
            (currentIndexPage && page === EPages.register) ||
            (currentIndexPage && page === EPages.register_analysis)
          );
        }),
        switchMap(({ indexPage, page }) => {
          if (page === EPages.register_analysis) {
            this.indexRegisterAnalysisPage = indexPage;

            return this.getAnalysisRegister().pipe(
              tap(({ analise_registro }) => {
                const cachedRegisterAnalysis =
                  this._registerAnalysis.getValue();

                const registerAnalysis = {
                  ...cachedRegisterAnalysis,
                  [indexPage]: {
                    content: analise_registro
                  }
                };

                this._registerAnalysis.next(registerAnalysis);
              })
            );
          }

          this.indexRegisterPage = indexPage;

          return this.getLessonTrackRegisters().pipe(
            tap(({ registros }) => this.populateRegister(registros))
          );
        })
      )
      .subscribe();

    this.listenPagesToSetValue();
  }

  private listenRegisterPagesAndSetValue() {
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
            this.indexRegisterPage = previous.indexPage;
          } else {
            this.indexRegisterPage = current.indexPage;
          }
        }),
        switchMap(() => this.registers$)
      )
      .pipe(filter((register) => !!register[this.indexRegisterPage]))
      .subscribe((register) => {
        this.registerContextService.resetAllFields();

        register[this.indexRegisterPage].forEach(
          ({ content, id, midiaId, type }) => {
            this.registerContextService.setFieldValue(type, {
              content,
              id,
              midiaId
            });
          }
        );
      });
  }

  private listenRegisterAnalysisPagesAndSetValue() {
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
            previous.page === EPages.register_analysis
          ) {
            this.indexRegisterAnalysisPage = previous.indexPage;
          } else {
            this.indexRegisterAnalysisPage = current.indexPage;
          }
        }),
        switchMap(() => this.registerAnalysis$)
      )
      .pipe(
        filter(
          (registerAnalysis) =>
            !!registerAnalysis[this.indexRegisterAnalysisPage]
        )
      )
      .subscribe((registerAnalysis) => {
        this.registerContextService.resetAnalysisField();

        if (registerAnalysis[this.indexRegisterAnalysisPage]) {
          const { content } = registerAnalysis[this.indexRegisterAnalysisPage];

          this.registerContextService.setAnalysis(content);
        }
      });
  }

  private listenPagesToSetValue() {
    this.listenRegisterPagesAndSetValue();
    this.listenRegisterAnalysisPagesAndSetValue();
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
    const alreadyPopulated = cachedRegister[this.indexRegisterPage]?.some(
      (register) => register.id === data.id
    );

    if (alreadyPopulated) {
      return;
    }

    const register: RegisterData = {
      ...cachedRegister,
      [this.indexRegisterPage]: [
        ...(cachedRegister[this.indexRegisterPage] ||= []),
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
}
