import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  BehaviorSubject,
  catchError,
  delay,
  EMPTY,
  finalize,
  Observable,
  of,
  pipe,
  take,
} from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { LoadingOverlayService } from 'src/app/shared/components/loading-overlay/loading-overlay.service';
import { ETypesComponentStrapi } from 'src/app/shared/enum/types-component-strapi.enum';
import { SaveRegisterPageDescription } from '../models/teacher-book.model';
import { RegisterSelectModalComponent } from '../pages/register/components/register-select-modal/register-select-modal.component';
import { RegisterService } from './api/register.service';
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

export interface RegisterField {
  id: number;
  type: KeyFieldContent;
  content: KeyValueFieldContent;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterContextService {
  private _registerFields = new BehaviorSubject<RegisterField[]>(
    Array.from({ length: 4 }, (_, index) => ({
      id: index + 1,
      type: null,
      content: null,
    }))
  );

  registerFields$: Observable<RegisterField[]> =
    this._registerFields.asObservable();

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
      selectedRegisterFieldId: this._selectedRegisterFieldId.getValue(),
    };
  }

  setFieldValue<Type extends KeyFieldContent>(
    type: Type,
    data: {
      id: number;
      content: FieldContent[Type];
    }
  ) {
    const registerFields = this._registerFields.getValue();
    const fieldIndex = registerFields.findIndex(field => field.id === data.id);

    registerFields[fieldIndex].type = type;
    registerFields[fieldIndex].content = data.content;

    this._registerFields.next(registerFields);
  }

  resetRegisterField(id: number) {
    const registerFields = this._registerFields.getValue();
    const fieldIndex = registerFields.findIndex(field => field.id === id);

    registerFields[fieldIndex].type = null;
    registerFields[fieldIndex].content = null;

    this._registerFields.next(registerFields);
  }

  openRegisterTypeModal(fieldId: number) {
    this._selectedRegisterFieldId.next(fieldId);

    const modalRef = this.ngbModal.open(RegisterSelectModalComponent, {
      centered: true,
      modalDialogClass: 'register-select-modal',
    });

    modalRef.closed
      .pipe(take(1))
      .subscribe(() => this._selectedRegisterFieldId.next(null));
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
          },
        },
      },
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
          content,
        });
      });
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
              content: {
                src: attributes.url,
                alt: '',
              },
            });
            break;

          case 'video':
            this.setFieldValue(type, {
              id,
              content: {
                src: attributes.url,
                type: attributes.mime,
              },
            });
            break;

          case 'audio':
            this.setFieldValue(type, {
              id,
              content: {
                src: attributes.url,
                type: attributes.mime,
              },
            });
            break;

          default:
            break;
        }
      });
  }

  removeRegisterField(fieldId: number) {
    this.loadingOverlayService.open();

    // TO-DO

    of(true)
      .pipe(
        take(1),
        delay(700),
        finalize(() => this.loadingOverlayService.remove())
      )
      .subscribe(() => {
        this.resetRegisterField(fieldId);
      });
  }
}
