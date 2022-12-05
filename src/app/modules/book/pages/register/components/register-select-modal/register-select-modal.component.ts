import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter, fromEvent, map, Subject, takeUntil } from 'rxjs';
import { DOMEvent } from 'src/app/shared/types/dom-event';
import { FileService } from 'src/app/shared/utils/services/file/file.service';
import { RegisterService } from '../../../../services/register.service';
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
    private registerService: RegisterService,
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
            !!this.registerService.snapshot.selectedRegisterFieldId
        ),
        map(({ target }) => ({
          type: this.selectedInputType,
          file: target.files[0],
          id: this.registerService.snapshot.selectedRegisterFieldId,
        }))
      )
      .subscribe(async ({ type, file, id }) => {
        const base64 = (await this.fileService.base64Encode(file)) as string;

        switch (type) {
          case 'image':
            this.registerService.setFieldValue(id, {
              type: 'image',
              value: {
                src: base64,
                alt: '',
              },
            });
            break;
          case 'video':
            this.registerService.setFieldValue(id, {
              type: 'video',
              value: {
                src: '',
                type: 'video/mp4',
              },
            });
            break;
          case 'audio':
            this.registerService.setFieldValue(id, {
              type: 'audio',
              value: {
                src: '',
                type: 'audio/mp3',
              },
            });
            break;
          default:
            return;
        }

        delete this.fileInput.nativeElement.files;

        this.registerService.resetSelectedRegisterField();
        this.ngbActiveModal.close();
      });
  }

  handleCloseModal() {
    this.registerService.resetSelectedRegisterField();
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
