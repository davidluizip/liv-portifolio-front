import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  finalize,
  iif,
  Observable,
  take
} from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { LoadingOverlayService } from 'src/app/shared/components/loading-overlay/loading-overlay.service';
import { ETypesComponentStrapi } from 'src/app/shared/enums/types-component-strapi.enum';
import {
  CurrentRegisterPageType,
  RegisterType
} from '../enums/register-type.enum';
import {
  SaveRegisterAnalysis,
  SaveRegisterPageDescription
} from '../../../shell/models/teacher-book.model';

import { PageControllerService } from '../../../shell/services/page-controller.service';
import { ProfessorAnalysisModalComponent } from '../components/professor-analysis-modal/professor-analysis-modal.component';
import { RegisterSelectModalComponent } from '../components/register-select-modal/register-select-modal.component';
import { RegisterService } from './api/register.service';

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

interface RegisterAnalysisData<T> {
  indexPage: number;
  data: T;
}

type RegisterAnalysisField = Record<
  'previous' | 'current',
  RegisterAnalysisData<RegisterField[]>
>;

type ProfessorAnalyseField = Record<
  'previous' | 'current',
  RegisterAnalysisData<string>
>;

interface RegisterTypeModal {
  fieldId: number;
  indexPage: number;
  registerPageType: RegisterType;
  currentRegisterPageType?: CurrentRegisterPageType;
}

interface ProfessorAnalysisValue {
  analyse: string;
  currentRegisterPageType: CurrentRegisterPageType;
  indexPage: number;
}

interface FieldRegisterAnalysisValue<Type extends KeyFieldContent> {
  field: {
    type: Type;
    data: {
      id: number;
      midiaId: number;
      content: FieldContent[Type];
    };
  };
  currentRegisterPageType: CurrentRegisterPageType;
  indexPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterContextService {
  private fields = Array.from({ length: 6 }, (_, index) => ({
    id: index + 1,
    midiaId: null,
    type: null,
    content: null
  }));

  private indexPage: number;
  private registerPageType: RegisterType;
  private currentRegisterPageType: CurrentRegisterPageType;

  private _registerFields = new BehaviorSubject<RegisterField[]>(
    this.fields.slice(0, 4)
  );

  registerFields$: Observable<RegisterField[]> =
    this._registerFields.asObservable();

  private _registerAnalysisFields = new BehaviorSubject<RegisterAnalysisField>({
    current: {
      indexPage: null,
      data: this.fields.slice(4, 6)
    },
    previous: {
      indexPage: null,
      data: this.fields.slice(4, 6)
    }
  });

  registerAnalysisFields$: Observable<RegisterAnalysisField> =
    this._registerAnalysisFields.asObservable();

  private _registerAnalysis = new BehaviorSubject<ProfessorAnalyseField>({
    previous: {
      indexPage: null,
      data: null
    },
    current: {
      indexPage: null,
      data: null
    }
  });
  registerAnalysis$: Observable<ProfessorAnalyseField> =
    this._registerAnalysis.asObservable();

  private _selectedRegisterFieldId = new BehaviorSubject<number | null>(null);

  constructor(
    private ngbModal: NgbModal,
    private registerService: RegisterService,
    private toastService: ToastService,
    private pageControllerService: PageControllerService,
    private loadingOverlayService: LoadingOverlayService
  ) {}

  get snapshot() {
    return {
      registerFields: this._registerFields.getValue(),
      registerAnalysisFields: this._registerAnalysisFields.getValue(),
      registerAnalysis: this._registerAnalysis.getValue(),
      selectedRegisterFieldId: this._selectedRegisterFieldId.getValue()
    };
  }

  setProfessorAnalyse({
    analyse,
    currentRegisterPageType,
    indexPage
  }: ProfessorAnalysisValue) {
    const key =
      currentRegisterPageType === CurrentRegisterPageType.previous
        ? 'previous'
        : 'current';

    const registerAnalysis = this._registerAnalysis.getValue();

    registerAnalysis[key].data = analyse;
    registerAnalysis[key].indexPage = indexPage;

    this._registerAnalysis.next({
      ...registerAnalysis,
      [key]: registerAnalysis[key]
    });
  }

  setFieldRegisterValue<Type extends KeyFieldContent>(
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

  setProfessorRegisterAnalysisValue<Type extends KeyFieldContent>({
    field,
    indexPage,
    currentRegisterPageType
  }: FieldRegisterAnalysisValue<Type>) {
    const key =
      currentRegisterPageType === CurrentRegisterPageType.previous
        ? 'previous'
        : 'current';

    const { data, type } = field;

    const registerAnalysisFields = this._registerAnalysisFields.getValue();
    const fieldIndex = registerAnalysisFields[key].data.findIndex(
      (data) => data.id === field.data.id
    );

    registerAnalysisFields[key].indexPage = indexPage;
    registerAnalysisFields[key].data[fieldIndex].type = type;
    registerAnalysisFields[key].data[fieldIndex].midiaId = data.midiaId;
    registerAnalysisFields[key].data[fieldIndex].content = data.content;

    this._registerAnalysisFields.next({
      ...registerAnalysisFields,
      [key]: registerAnalysisFields[key]
    });
  }

  private setFieldValue<Type extends KeyFieldContent>(
    type: Type,
    data: {
      id: number;
      midiaId: number;
      content: FieldContent[Type];
    }
  ) {
    if (this.registerPageType === RegisterType.register_analysis) {
      this.setProfessorRegisterAnalysisValue({
        currentRegisterPageType: this.currentRegisterPageType,
        indexPage: this.indexPage,
        field: {
          type,
          data
        }
      });
    } else {
      this.setFieldRegisterValue(type, data);
    }
  }

  resetProfessorAnalysisFields(
    currentRegisterPageType: CurrentRegisterPageType,
    indexPage: number
  ) {
    const key =
      currentRegisterPageType === CurrentRegisterPageType.current
        ? 'current'
        : 'previous';

    const { registerAnalysisFields, registerAnalysis } = this.snapshot;

    this._registerAnalysis.next({
      ...registerAnalysis,
      [key]: {
        indexPage,
        data: null
      }
    });
    this._registerAnalysisFields.next({
      ...registerAnalysisFields,
      [key]: {
        indexPage,
        data: registerAnalysisFields[key].data.map((field) => ({
          id: field.id,
          midiaId: null,
          type: null,
          content: null
        }))
      }
    });
  }

  resetRegisterFields() {
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

  openRegisterTypeModal({
    fieldId,
    indexPage,
    registerPageType,
    currentRegisterPageType
  }: RegisterTypeModal) {
    this._selectedRegisterFieldId.next(fieldId);
    this.indexPage = indexPage;
    this.registerPageType = registerPageType;
    this.currentRegisterPageType = currentRegisterPageType;

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
      .subscribe(() => {
        this.setFieldValue('text', {
          id,
          midiaId: 1,
          content
        });
      });
  }

  saveRegisterAnalysis(analyse: string) {
    this.loadingOverlayService.open();

    const requestPayload: SaveRegisterAnalysis = {
      bookId: this.pageControllerService.snapshot.bookId,
      indexPage: this.indexPage,
      text: analyse
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
      .subscribe(() =>
        this.setProfessorAnalyse({
          analyse,
          currentRegisterPageType: this.currentRegisterPageType,
          indexPage: this.indexPage
        })
      );
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
