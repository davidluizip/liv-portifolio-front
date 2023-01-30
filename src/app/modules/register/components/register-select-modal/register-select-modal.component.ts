import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter, fromEvent, map, Subject, takeUntil } from 'rxjs';

import { DOMEvent } from 'src/app/shared/interfaces/dom-event';
import { RegisterContextService } from '../../services/register-context.service';
import { StudentSpeechRecordModalComponent } from '../student-speech-record-modal/student-speech-record-modal.component';

interface RegisterAction {
  icon: string;
  name: string;
  type: 'image' | 'text' | 'audio' | 'video';
}

@Component({
  selector: 'liv-register-select-modal',
  templateUrl: './register-select-modal.component.html',
  styleUrls: ['./register-select-modal.component.scss']
})
export class RegisterSelectModalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  registerActions: RegisterAction[] = [
    {
      icon: 'gallery',
      type: 'image',
      name: 'Imagem'
    },
    {
      icon: 'typography',
      type: 'text',
      name: 'Fala do aluno'
    },
    {
      icon: 'video-camera',
      type: 'video',
      name: 'Vídeo'
    },
    {
      icon: 'microphone',
      type: 'audio',
      name: 'Áudio do aluno'
    }
  ];

  private selectedInputType: RegisterAction['type'];
  private destroy$ = new Subject<boolean>();

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private registerContextService: RegisterContextService
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
          (event) =>
            !!event.target.files &&
            !!this.registerContextService.snapshot.selectedRegisterFieldId
        ),
        map(({ target }) => {
          const type = this.selectedInputType as Exclude<
            RegisterAction['type'],
            'text'
          >;

          return {
            type,
            file: target.files[0],
            id: this.registerContextService.snapshot.selectedRegisterFieldId
          };
        })
      )
      .subscribe(({ type, file, id }) => {
        const data = new FormData();

        data.append('files', file);
        data.append('position', String(id));
        this.registerContextService
          .saveMediaRegister(id, data, type)
          .add(() => {
            this.fileInput.nativeElement.value = null;
            this.ngbActiveModal.close();
          });
      });
  }

  handleCloseModal() {
    this.ngbActiveModal.close();
  }

  handleActionIcon(action: RegisterAction) {
    this.selectedInputType = action.type;

    switch (action.type) {
      case 'text':
        this.ngbModal.open(StudentSpeechRecordModalComponent, {
          centered: true,
          modalDialogClass: 'register-select-modal'
        });
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
