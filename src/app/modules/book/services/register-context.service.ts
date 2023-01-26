import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  BehaviorSubject,
  catchError,
  delay,
  EMPTY,
  finalize,
  iif,
  Observable,
  of,
  pipe,
  take
} from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { LoadingOverlayService } from 'src/app/shared/components/loading-overlay/loading-overlay.service';
import { ETypesComponentStrapi } from 'src/app/shared/enum/types-component-strapi.enum';
import {
  SaveRegisterAnalysis,
  SaveRegisterPageDescription
} from '../models/teacher-book.model';
import { ProfessorAnalysisModalComponent } from '../pages/register-analysis/professor-analysis-modal/professor-analysis-modal.component';
import { RegisterSelectModalComponent } from '../pages/register/components/register-select-modal/register-select-modal.component';
import { RegisterService } from './api/register.service';
import { LessonTrackRegisterContextService } from './lesson-track-register-context.service';
import { PageControllerService } from './page-controller.service';

interface TextContent {
  about: string;
  name: string;
}

interface ImageContent {
  src: string;
  alt?: string;
}

interface VideoContent {
  src: string;
  type?: string;
}

interface AudioContent {
  src: string;
  type?: string;
}

export type FieldContent = {
  text: TextContent;
  image: ImageContent;
  video: VideoContent;
  audio: AudioContent;
};

export type KeyFieldContent = keyof FieldContent;
export type KeyValueFieldContent = FieldContent[KeyFieldContent];

export interface RemoveRegisterField {
  type: KeyFieldContent;
  midiaId: number;
  fieldId: number;
}

export interface RegisterIndexField {
  [key: number]: RegisterField[];
}

export interface RegisterField {
  id: number;
  midiaId: number;
  type: KeyFieldContent;
  content: KeyValueFieldContent;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterContextService {
  private indexPage: number;
  private _registerFields = new BehaviorSubject<RegisterField[]>(
    Array.from({ length: 6 }, (_, index) => ({
      id: index + 1,
      midiaId: null,
      type: null,
      content: null
    }))
  );

  registerFields$: Observable<RegisterField[]> =
    this._registerFields.asObservable();

  private _registerAnalysis = new BehaviorSubject<string | null>(null);
  registerAnalysis$: Observable<string> = this._registerAnalysis.asObservable();

  private _selectedRegisterFieldId = new BehaviorSubject<number | null>(null);

  constructor(
    private ngbModal: NgbModal,
    private registerService: RegisterService,
    //private lessonTrackRegisterContextService: LessonTrackRegisterContextService,
    private toastService: ToastService,
    private pageControllerService: PageControllerService,
    private loadingOverlayService: LoadingOverlayService
  ) {}

  get snapshot() {
    return {
      registerFields: this._registerFields.getValue(),
      selectedRegisterFieldId: this._selectedRegisterFieldId.getValue()
    };
  }

  setAnalysis(analysis: string) {
    this._registerAnalysis.next(analysis);
  }

  resetAnalysisField() {
    this._registerAnalysis.next(null);
  }

  setFieldValue<Type extends KeyFieldContent>(
    type: Type,
    data: {
      id: number;
      midiaId: number;
      content: FieldContent[Type];
    }
  ) {
    const registerFields = this._registerFields.getValue();
    const fieldIndex = registerFields.findIndex(
      (field) => field.id === data.id
    );
    registerFields[fieldIndex].type = type;
    registerFields[fieldIndex].midiaId = data.midiaId;
    registerFields[fieldIndex].content = data.content;

    this._registerFields.next(registerFields);
  }

  resetAllFields() {
    const { registerFields } = this.snapshot;
    this._registerFields.next(
      registerFields.map((field) => ({
        id: field.id,
        midiaId: null,
        type: null,
        content: null
      }))
    );
  }

  resetRegisterField(id: number) {
    const registerFields = this._registerFields.getValue();
    const fieldIndex = registerFields.findIndex((field) => field.id === id);

    registerFields[fieldIndex].type = null;
    registerFields[fieldIndex].content = null;

    this._registerFields.next(registerFields);
  }

  openRegisterTypeModal(fieldId: number, indexPage: number) {
    this._selectedRegisterFieldId.next(fieldId);
    this.indexPage = indexPage;

    const modalRef = this.ngbModal.open(RegisterSelectModalComponent, {
      centered: true,
      modalDialogClass: 'register-select-modal'
    });

    modalRef.closed
      .pipe(take(1))
      .subscribe(() => this._selectedRegisterFieldId.next(null));
  }

  openRegisterAnalysisModal(indexPage: number) {
    this.indexPage = indexPage;

    this.ngbModal.open(ProfessorAnalysisModalComponent, {
      centered: true,
      modalDialogClass: 'register-select-modal'
    });
  }

  saveTextRegister(id: number, content: TextContent) {
    this.loadingOverlayService.open();

    const requestPayload: SaveRegisterPageDescription = {
      data: {
        registros: {
          texto: {
            alternativeText: id,
            descricao: content.about,
            nome: content.name,
            index_page: this.indexPage
          }
        }
      }
    };

    this.registerService
      .saveRegisterDescription(
        this.pageControllerService.snapshot.bookId,
        requestPayload
      )
      .pipe(
        take(1),
        catchError(() => {
          this.toastService.error(
            'Houve um erro ao fazer o salvar a fala do aluno'
          );
          return EMPTY;
        }),
        finalize(() => {
          this.loadingOverlayService.remove();
        })
      )
      .subscribe((data) => {
        this.setFieldValue('text', {
          id,
          midiaId: 1,
          content
        });
      });
  }

  saveRegisterAnalysis(text: string) {
    this.loadingOverlayService.open();

    const requestPayload: SaveRegisterAnalysis = {
      bookId: this.pageControllerService.snapshot.bookId,
      indexPage: this.indexPage,
      text
    };

    return this.registerService
      .saveRegisterAnalysis(requestPayload)
      .pipe(
        take(1),
        catchError(() => {
          this.toastService.error(
            'Houve um erro ao fazer o salvar a analise de registro'
          );
          return EMPTY;
        }),
        finalize(() => {
          this.loadingOverlayService.remove();
        })
      )
      .subscribe(() => this.setAnalysis(text));
  }

  saveMediaRegister(
    id: number,
    data: FormData,
    type: Exclude<KeyFieldContent, 'text'>
  ) {
    this.loadingOverlayService.open();

    return this.registerService
      .uploadMedia(
        data,
        this.pageControllerService.snapshot.bookId,
        this.indexPage,
        ETypesComponentStrapi.registersPUT
      )
      .pipe(
        take(1),
        catchError(() => {
          this.toastService.error(
            'Houve um erro ao fazer o upload do seu arquivo'
          );
          return EMPTY;
        }),
        finalize(() => {
          this.loadingOverlayService.remove();
        })
      )
      .subscribe(({ data: { attributes } }) => {
        switch (type) {
          case 'image':
            this.setFieldValue(type, {
              id,
              midiaId: attributes.id,
              content: {
                src: attributes.url,
                alt: ''
              }
            });
            break;

          case 'video':
            this.setFieldValue(type, {
              id,
              midiaId: attributes.id,
              content: {
                src: attributes.url,
                type: attributes.mime
              }
            });
            break;

          case 'audio':
            this.setFieldValue(type, {
              id,
              midiaId: attributes.id,
              content: {
                src: attributes.url,
                type: attributes.mime
              }
            });
            break;

          default:
            break;
        }
      });
  }

  validateRemoveMidia({ type, midiaId }: Omit<RemoveRegisterField, 'fieldId'>) {
    const { bookId } = this.pageControllerService.snapshot;

    return iif(
      () => type === 'text',
      this.registerService.deleteText(bookId, midiaId),
      this.registerService.deleteMidia(midiaId)
    );
  }

  removeRegisterField({ type, midiaId, fieldId }: RemoveRegisterField) {
    this.loadingOverlayService.open();

    this.registerService.deleteMidia;

    this.validateRemoveMidia({ type, midiaId })
      .pipe(
        take(1),
        finalize(() => this.loadingOverlayService.remove())
      )
      .subscribe(() => {
        this.resetRegisterField(fieldId);
      });
  }
}
