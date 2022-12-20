import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter, fromEvent, map, Subject, takeUntil } from 'rxjs';
import { DOMEvent } from 'src/app/shared/interfaces/dom-event';
import { FileService } from 'src/app/shared/utils/services/file/file.service';
import { RegisterContextService } from '../../../../services/register-context.service';
import { StudentSpeechRecordModalComponent } from '../student-speech-record-modal/student-speech-record-modal.component';

interface RegisterAction {
  icon: string;
  name: string;
  type: 'image' | 'text' | 'audio' | 'video';
}

@Component({
  selector: 'liv-register-select-modal',
  templateUrl: './register-select-modal.component.html',
  styleUrls: ['./register-select-modal.component.scss'],
})
export class RegisterSelectModalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  registerActions: RegisterAction[] = [
    {
      icon: 'gallery',
      type: 'image',
      name: 'Imagem',
    },
    {
      icon: 'typography',
      type: 'text',
      name: 'Fala do aluno',
    },
    {
      icon: 'video-camera',
      type: 'video',
      name: 'Vídeo',
    },
    {
      icon: 'microphone',
      type: 'audio',
      name: 'Áudio do aluno',
    },
  ];

  private selectedInputType: RegisterAction['type'];
  private destroy$ = new Subject<boolean>();

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private registerContextService: RegisterContextService,
    private fileService: FileService
  ) {}

  ngAfterViewInit(): void {
    this.listenerInputChangeEvent();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  listenerInputChangeEvent(): void {
    fromEvent<DOMEvent<HTMLInputElement>>(
      this.fileInput.nativeElement,
      'change'
    )
      .pipe(
        takeUntil(this.destroy$),
        filter(
          event =>
            !!event.target.files &&
            !!this.registerContextService.snapshot.selectedRegisterFieldId
        ),
        filter(
          () => !!this.registerContextService.snapshot.selectedRegisterFieldId
        ),
        map(({ target }) => ({
          type: this.selectedInputType,
          file: target.files![0],
          id: this.registerContextService.snapshot.selectedRegisterFieldId!,
        }))
      )
      .subscribe(async ({ type, file, id }) => {
        console.log(file, type);

        switch (type) {
          case 'image':
            {
              const base64 = (await this.fileService.base64Encode(
                file
              )) as string;
              this.registerContextService.setFieldValue(id, {
                type: 'image',
                value: {
                  src: base64,
                  alt: '',
                },
              });
            }
            break;
          case 'video':
            {
              const url = (await this.fileService.base64Encode(file)) as string;
              this.registerContextService.setFieldValue(id, {
                type: 'video',
                value: {
                  src: url,
                  type: file.type,
                },
              });
            }

            break;
          case 'audio':
            {
              const url = URL.createObjectURL(file);
              this.registerContextService.setFieldValue(id, {
                type: 'audio',
                value: {
                  src: url,
                  type: file.type,
                },
              });
            }

            break;
          default:
            return;
        }

        this.fileInput.nativeElement.value = null;

        this.registerContextService.resetSelectedRegisterField();
        this.ngbActiveModal.close();
      });
  }

  handleCloseModal() {
    this.registerContextService.resetSelectedRegisterField();
    this.ngbActiveModal.close();
  }

  handleActionIcon(action: RegisterAction) {
    this.selectedInputType = action.type;

    switch (action.type) {
      case 'text':
        this.ngbModal.open(StudentSpeechRecordModalComponent, {
          centered: true,
          modalDialogClass: 'register-select-modal',
        });
        action;
        break;
      case 'image':
        {
          this.fileInput.nativeElement.accept =
            'image/png, image/gif, image/jpeg';
          this.fileInput.nativeElement.click();
        }
        break;
      case 'video':
        {
          this.fileInput.nativeElement.accept = 'video/*';
          this.fileInput.nativeElement.click();
        }
        break;
      case 'audio':
        {
          this.fileInput.nativeElement.accept = 'audio/*';
          this.fileInput.nativeElement.click();
        }
        break;
      default:
        return;
    }
  }
}
