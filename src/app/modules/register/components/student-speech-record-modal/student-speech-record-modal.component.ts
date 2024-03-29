import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageControllerService } from 'src/app/shell/services/page-controller.service';
import { RegisterContextService } from '../../services/register-context.service';

@Component({
  selector: 'liv-student-speech-record-modal',
  templateUrl: './student-speech-record-modal.component.html',
  styleUrls: ['./student-speech-record-modal.component.scss']
})
export class StudentSpeechRecordModalComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('aboutStudent') textarea: ElementRef<HTMLTextAreaElement>;
  form: FormGroup;

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private registerContextService: RegisterContextService,
    private pageControllerService: PageControllerService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      about: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(120)])
      ),
      name: new FormControl(
        '',
        Validators.compose([Validators.minLength(3), Validators.maxLength(24)])
      )
    });
  }

  ngAfterViewInit(): void {
    this.textarea.nativeElement.focus();
  }

  handleCloseModal() {
    this.ngbActiveModal.close();
  }

  handleFinishStudentSpeechRecordRegister() {
    const { selectedRegisterFieldId: id } =
      this.registerContextService.snapshot;

    const { about, name } = this.form.value;

    this.registerContextService.saveTextRegister(id, {
      about,
      name
    });

    this.ngbModal.dismissAll();
  }
}
