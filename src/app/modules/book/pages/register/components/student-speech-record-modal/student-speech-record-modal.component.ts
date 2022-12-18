import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterService } from 'src/app/modules/book/services/register.service';

@Component({
  selector: 'liv-student-speech-record-modal',
  templateUrl: './student-speech-record-modal.component.html',
  styleUrls: ['./student-speech-record-modal.component.scss'],
})
export class StudentSpeechRecordModalComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('aboutStudent') textarea: ElementRef<HTMLTextAreaElement>;
  form: FormGroup;

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private registerService: RegisterService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      about: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(64)])
      ),
      name: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(24),
        ])
      ),
    });
  }

  ngAfterViewInit(): void {
    this.textarea.nativeElement.focus();
  }

  handleCloseModal() {
    this.ngbActiveModal.close();
  }

  handleFinishStudentSpeechRecordRegister() {
    const { selectedRegisterFieldId: fieldId } = this.registerService.snapshot;

    const { about, name } = this.form.value;

    if (fieldId) {
      this.registerService.setFieldValue(fieldId, {
        type: 'text',
        value: {
          about,
          name,
        },
      });
    }

    this.ngbModal.dismissAll();
  }
}
