import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterContextService } from 'src/app/modules/book/services/register-context.service';

@Component({
  selector: 'liv-professor-analysis-modal',
  templateUrl: './professor-analysis-modal.component.html',
  styleUrls: ['./professor-analysis-modal.component.scss']
})
export class ProfessorAnalysisModalComponent implements OnInit, AfterViewInit {
  @ViewChild('aboutStudent') textarea: ElementRef<HTMLTextAreaElement>;
  public form: FormGroup;
  public savingAnalysis = false;

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private registerContextService: RegisterContextService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      analysis: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(120)
        ])
      )
    });
  }

  ngAfterViewInit(): void {
    this.textarea.nativeElement.focus();
  }

  handleCloseModal() {
    this.ngbActiveModal.close();
  }

  handleSaveProfessorAnalysis() {
    const { analysis } = this.form.value;

    this.savingAnalysis = true;

    this.registerContextService.saveRegisterAnalysis(analysis).add(() => {
      this.ngbActiveModal.close();
      this.savingAnalysis = false;
    });
  }
}
